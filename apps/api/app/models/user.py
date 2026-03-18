from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    telegram_id = Column(BigInteger, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")
    memberships = relationship("CompanyMember", back_populates="user")
    buyer_profile = relationship("BuyerProfile", back_populates="user", uselist=False)
    seller_profile = relationship("SellerProfile", back_populates="user", uselist=False)
    specialist_profile = relationship("SpecialistProfile", back_populates="user", uselist=False)

class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False) # buyer, seller, specialist, agency, admin
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="roles")
