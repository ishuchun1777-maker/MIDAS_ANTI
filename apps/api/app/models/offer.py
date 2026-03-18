import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

class Offer(Base):
    __tablename__ = "offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Target asset or entity the offer is made for
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True)
    
    # Participants
    sender_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Pricing
    price = Column(Float, nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    
    # Details
    deliverables_summary = Column(Text, nullable=True)
    timeline_summary = Column(Text, nullable=True)
    message = Column(Text, nullable=True)
    
    # Status (e.g. pending, accepted, rejected, countered, expired)
    status = Column(String(32), default="pending", nullable=False)
    
    # Dates
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    sender = relationship("User", foreign_keys=[sender_user_id], backref="offers_sent")
    receiver = relationship("User", foreign_keys=[receiver_user_id], backref="offers_received")
    media_asset = relationship("MediaAsset", backref="offers")
    deal = relationship("Deal", back_populates="offer", uselist=False)
