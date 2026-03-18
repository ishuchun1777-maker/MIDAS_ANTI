from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base

class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    business_name = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    subindustry = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    avg_budget_min = Column(Float, nullable=True)
    avg_budget_max = Column(Float, nullable=True)
    target_regions = Column(JSON, nullable=True)
    preferred_channels = Column(JSON, nullable=True)
    public_status = Column(String, default="private")
    trust_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="buyer_profile")

class SellerProfile(Base):
    __tablename__ = "seller_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    seller_type = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    niche = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    languages = Column(JSON, nullable=True)
    primary_regions = Column(JSON, nullable=True)
    trust_score = Column(Float, default=0.0)
    verification_status = Column(String, default="pending")
    public_status = Column(String, default="private")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="seller_profile")

class SpecialistProfile(Base):
    __tablename__ = "specialist_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    specialist_type = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)
    tools = Column(JSON, nullable=True)
    portfolio_url = Column(String, nullable=True)
    hourly_rate = Column(Float, nullable=True)
    project_rate_from = Column(Float, nullable=True)
    trust_score = Column(Float, default=0.0)
    verification_status = Column(String, default="pending")
    public_status = Column(String, default="private")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="specialist_profile")

class AgencyProfile(Base):
    __tablename__ = "agency_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    agency_name = Column(String, nullable=True)
    agency_type = Column(String, nullable=True) # e.g. 'Outdoor', 'Digital', 'Full-service'
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    target_regions = Column(JSON, nullable=True)
    trust_score = Column(Float, default=0.0)
    verification_status = Column(String, default="pending")
    public_status = Column(String, default="private")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="agency_profile")
