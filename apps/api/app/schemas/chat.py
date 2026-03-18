from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class MessageBase(BaseModel):
    content: str
    is_read: bool = False

class MessageCreate(MessageBase):
    pass
    # We don't include deal_id and sender_id here, as they are determined via path and token.

class MessageResponse(MessageBase):
    id: UUID
    deal_id: UUID
    sender_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MessageUpdate(BaseModel):
    is_read: bool
