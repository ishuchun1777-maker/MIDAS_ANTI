from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional

class OfferBase(BaseModel):
    media_asset_id: Optional[UUID] = None
    price: float
    currency: str = "USD"
    deliverables_summary: Optional[str] = None
    timeline_summary: Optional[str] = None
    message: Optional[str] = None

class OfferCreate(OfferBase):
    receiver_user_id: UUID

class OfferUpdate(BaseModel):
    status: Optional[str] = None
    price: Optional[float] = None
    deliverables_summary: Optional[str] = None
    timeline_summary: Optional[str] = None
    message: Optional[str] = None

class OfferResponse(OfferBase):
    id: UUID
    sender_user_id: UUID
    receiver_user_id: UUID
    status: str
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
