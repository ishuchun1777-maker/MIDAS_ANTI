from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.models.deal import DealStatus
from app.schemas.user import UserResponse
from app.schemas.inventory import MediaAssetResponse

class DealBase(BaseModel):
    offer_id: Optional[UUID] = None
    media_asset_id: UUID
    buyer_id: UUID
    seller_id: UUID
    price: float
    status: DealStatus = DealStatus.IN_PROGRESS
    notes: Optional[str] = None

class DealCreate(DealBase):
    pass

class DealResponse(DealBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    # Optional nested responses
    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None
    media_asset: Optional[MediaAssetResponse] = None

    class Config:
        from_attributes = True

class DealUpdate(BaseModel):
    status: Optional[DealStatus] = None
    notes: Optional[str] = None
