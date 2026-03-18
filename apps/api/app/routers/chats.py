from typing import List, Dict
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.deal import Deal
from app.models.chat import Message
from app.schemas.chat import MessageCreate, MessageResponse

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # deal_id -> list of active websockets
        self.active_connections: Dict[UUID, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, deal_id: UUID):
        await websocket.accept()
        if deal_id not in self.active_connections:
            self.active_connections[deal_id] = []
        self.active_connections[deal_id].append(websocket)

    def disconnect(self, websocket: WebSocket, deal_id: UUID):
        if deal_id in self.active_connections:
            self.active_connections[deal_id].remove(websocket)
            if not self.active_connections[deal_id]:
                del self.active_connections[deal_id]

    async def broadcast(self, message: dict, deal_id: UUID):
        if deal_id in self.active_connections:
            for connection in self.active_connections[deal_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.get("/{deal_id}/history", response_model=List[MessageResponse])
async def get_chat_history(
    deal_id: UUID,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify user is part of the deal
    stmt_deal = select(Deal).where(Deal.id == deal_id)
    result_deal = await db.execute(stmt_deal)
    deal = result_deal.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    if deal.buyer_id != current_user.id and deal.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this chat")
        
    stmt_msg = select(Message).where(Message.deal_id == deal_id).order_by(Message.created_at.asc()).offset(skip).limit(limit)
    result_msg = await db.execute(stmt_msg)
    messages = result_msg.scalars().all()
    
    return messages

@router.post("/{deal_id}", response_model=MessageResponse)
async def send_message_rest(
    deal_id: UUID,
    message_in: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify deal access
    stmt = select(Deal).where(Deal.id == deal_id)
    result = await db.execute(stmt)
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    if deal.buyer_id != current_user.id and deal.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to message here")
        
    new_msg = Message(
        deal_id=deal_id,
        sender_id=current_user.id,
        content=message_in.content
    )
    db.add(new_msg)
    await db.commit()
    await db.refresh(new_msg)
    
    # Broadcast to connected WS clients
    await manager.broadcast({
        "id": str(new_msg.id),
        "deal_id": str(new_msg.deal_id),
        "sender_id": str(new_msg.sender_id),
        "content": new_msg.content,
        "is_read": new_msg.is_read,
        "created_at": new_msg.created_at.isoformat()
    }, deal_id)
    
    return new_msg

# NOTE: For websockets, we normally pass token via query parameter or headers, but here we just accept deal_id.
# Authentication inside WS is mocked for now since `token` isn't fully integrated in frontend yet.
@router.websocket("/ws/{deal_id}")
async def websocket_endpoint(websocket: WebSocket, deal_id: UUID, token: str = None):
    # Accept connection regardless to test easily
    await manager.connect(websocket, deal_id)
    try:
        while True:
            # We wait for messages but normally clients just use the REST endpoint to post, and WS just to receive.
            # But we can also handle incoming WS text here if needed.
            data = await websocket.receive_text()
            # Optionally handle incoming WS messages directly here...
    except WebSocketDisconnect:
        manager.disconnect(websocket, deal_id)
