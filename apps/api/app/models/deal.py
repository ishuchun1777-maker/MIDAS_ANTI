import uuid
from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import enum

class DealStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class Deal(Base):
    __tablename__ = "deals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    offer_id = Column(UUID(as_uuid=True), ForeignKey("offers.id"), nullable=True) # It can be direct without offer
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    price = Column(Numeric(12, 2), nullable=False) # Agreed final price
    status = Column(Enum(DealStatus), default=DealStatus.IN_PROGRESS, nullable=False)
    notes = Column(Text, nullable=True) # Any requirements/notes agreed upon
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    offer = relationship("Offer", back_populates="deal")
    media_asset = relationship("MediaAsset")
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
