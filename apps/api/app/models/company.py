from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_type = Column(String, nullable=False) # business, agency, etc
    name = Column(String, nullable=False)
    legal_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    city = Column(String, nullable=True)
    address = Column(String, nullable=True)
    verification_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    members = relationship("CompanyMember", back_populates="company", cascade="all, delete-orphan")

class CompanyMember(Base):
    __tablename__ = "company_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    permission_level = Column(String, default="member") # owner, admin, member
    title = Column(String, nullable=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="members")
    user = relationship("User", back_populates="memberships")
