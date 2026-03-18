from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.deal import Deal
from app.schemas.deal import DealResponse, DealUpdate

router = APIRouter()

@router.get("/", response_model=List[DealResponse])
async def get_my_deals(
    skip: int = 0,
    limit: int = 20,
    role: str = Query("all", description="Filter by role: 'buyer', 'seller', or 'all'"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all deals where the current user is either the buyer or the seller.
    """
    stmt = select(Deal).options(
        selectinload(Deal.buyer),
        selectinload(Deal.seller),
        selectinload(Deal.media_asset)
    )
    
    if role == "buyer":
        stmt = stmt.filter(Deal.buyer_id == current_user.id)
    elif role == "seller":
        stmt = stmt.filter(Deal.seller_id == current_user.id)
    else:
        stmt = stmt.filter((Deal.buyer_id == current_user.id) | (Deal.seller_id == current_user.id))
        
    stmt = stmt.order_by(Deal.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    deals = result.scalars().all()
    
    return deals

@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific deal by ID. User must be a participant.
    """
    stmt = select(Deal).options(
        selectinload(Deal.buyer),
        selectinload(Deal.seller),
        selectinload(Deal.media_asset)
    ).filter(Deal.id == deal_id)
    
    result = await db.execute(stmt)
    deal = result.scalars().first()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    if deal.buyer_id != current_user.id and deal.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this deal")
        
    return deal

@router.patch("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: UUID,
    update_data: DealUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update deal status or notes.
    """
    stmt = select(Deal).options(
        selectinload(Deal.buyer),
        selectinload(Deal.seller),
        selectinload(Deal.media_asset)
    ).filter(Deal.id == deal_id)
    
    result = await db.execute(stmt)
    deal = result.scalars().first()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
        
    if deal.buyer_id != current_user.id and deal.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this deal")
        
    if update_data.status is not None:
        deal.status = update_data.status
    if update_data.notes is not None:
        deal.notes = update_data.notes
        
    await db.commit()
    await db.refresh(deal)
    
    return deal
