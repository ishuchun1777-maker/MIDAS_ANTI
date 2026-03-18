from sqlalchemy import Column, String, Integer, Float, Boolean, Date, DateTime, ForeignKey, Text, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.core.database import Base

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_profile_id = Column(UUID(as_uuid=True), ForeignKey("seller_profiles.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    media_type = Column(String, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(120), nullable=True)
    social_link = Column(String(500), nullable=True)
    visibility = Column(String(32), default="public", nullable=False)
    status = Column(String(32), default="draft", nullable=False)
    verification_status = Column(String(32), default="not_started", nullable=False)
    public_slug = Column(String(255), unique=True, nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    seller_profile = relationship("SellerProfile", backref="media_assets")
    company = relationship("Company", backref="media_assets")
    
    regions = relationship("MediaAssetRegion", back_populates="media_asset", cascade="all, delete-orphan")
    formats = relationship("MediaAssetFormat", back_populates="media_asset", cascade="all, delete-orphan")
    pricing = relationship("MediaAssetPricing", back_populates="media_asset", cascade="all, delete-orphan")
    audience = relationship("MediaAssetAudience", uselist=False, back_populates="media_asset", cascade="all, delete-orphan")
    social_details = relationship("MediaAssetSocialDetails", uselist=False, back_populates="media_asset", cascade="all, delete-orphan")
    outdoor_details = relationship("MediaAssetOutdoorDetails", uselist=False, back_populates="media_asset", cascade="all, delete-orphan")
    files = relationship("MediaAssetFile", back_populates="media_asset", cascade="all, delete-orphan")
    availability = relationship("MediaAssetAvailability", back_populates="media_asset", cascade="all, delete-orphan")


class MediaAssetRegion(Base):
    __tablename__ = "media_asset_regions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    country_code = Column(String(8), nullable=True)
    city = Column(String(120), nullable=True)
    district = Column(String(120), nullable=True)
    address = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="regions")

class MediaAssetFormat(Base):
    __tablename__ = "media_asset_formats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    format_name = Column(String(64), nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    quantity_limit = Column(Integer, nullable=True)
    creative_requirements = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="formats")

class MediaAssetPricing(Base):
    __tablename__ = "media_asset_pricing"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    format_id = Column(UUID(as_uuid=True), ForeignKey("media_asset_formats.id", ondelete="SET NULL"), nullable=True)
    pricing_model = Column(String, nullable=False)
    currency = Column(String(8), default="USD", nullable=False)
    base_price = Column(Float, nullable=False)
    min_order_value = Column(Float, nullable=True)
    negotiable = Column(Boolean, default=False, nullable=False)
    valid_from = Column(Date, nullable=True)
    valid_to = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="pricing")

class MediaAssetAudience(Base):
    __tablename__ = "media_asset_audience"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), unique=True, nullable=False)
    total_reach = Column(Integer, nullable=True)
    avg_views = Column(Integer, nullable=True)
    avg_engagement_rate = Column(Float, nullable=True)
    male_percent = Column(Float, nullable=True)
    female_percent = Column(Float, nullable=True)
    age_13_17 = Column(Float, nullable=True)
    age_18_24 = Column(Float, nullable=True)
    age_25_34 = Column(Float, nullable=True)
    age_35_44 = Column(Float, nullable=True)
    age_45_plus = Column(Float, nullable=True)
    top_cities = Column(JSON, default=list, nullable=False)
    top_interests = Column(JSON, default=list, nullable=False)
    audience_quality_score = Column(Float, default=0.0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="audience")

class MediaAssetSocialDetails(Base):
    __tablename__ = "media_asset_social_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), unique=True, nullable=False)
    followers = Column(Integer, nullable=True)
    subscribers = Column(Integer, nullable=True)
    avg_story_views = Column(Integer, nullable=True)
    avg_post_views = Column(Integer, nullable=True)
    avg_video_views = Column(Integer, nullable=True)
    avg_comments = Column(Integer, nullable=True)
    avg_shares = Column(Integer, nullable=True)
    growth_rate = Column(Float, nullable=True)
    authenticity_score = Column(Float, default=0.0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="social_details")

class MediaAssetOutdoorDetails(Base):
    __tablename__ = "media_asset_outdoor_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), unique=True, nullable=False)
    width_m = Column(Float, nullable=True)
    height_m = Column(Float, nullable=True)
    resolution = Column(String(64), nullable=True)
    screen_type = Column(String(64), nullable=True)
    daily_traffic_estimate = Column(Integer, nullable=True)
    visibility_score = Column(Float, nullable=True)
    illumination = Column(Boolean, nullable=True)
    landmark_info = Column(Text, nullable=True)
    facing_direction = Column(String(64), nullable=True)
    installation_type = Column(String(64), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="outdoor_details")

class MediaAssetFile(Base):
    __tablename__ = "media_asset_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(Text, nullable=False)
    file_type = Column(String(32), nullable=False)
    caption = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="files")

class MediaAssetAvailability(Base):
    __tablename__ = "media_asset_availability"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    date_from = Column(Date, nullable=False)
    date_to = Column(Date, nullable=False)
    availability_status = Column(String(32), default="available", nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    media_asset = relationship("MediaAsset", back_populates="availability")

class Shortlist(Base):
    __tablename__ = "shortlists"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    media_asset_id = Column(UUID(as_uuid=True), ForeignKey("media_assets.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", backref="shortlisted_items")
    media_asset = relationship("MediaAsset", backref="shortlisted_by")

    # Ensure a user can only shortlist an asset once
    __table_args__ = (
        Index("ix_shortlist_user_asset", "user_id", "media_asset_id", unique=True),
    )

# Search Performance Indexes
Index("ix_media_assets_search_title", MediaAsset.title)
Index("ix_media_assets_search_category", MediaAsset.category)
Index("ix_media_assets_search_media_type", MediaAsset.media_type)
Index("ix_media_assets_discovery_status", MediaAsset.status, MediaAsset.visibility)
Index("ix_media_asset_regions_city", MediaAssetRegion.city)
Index("ix_media_asset_pricing_base_price", MediaAssetPricing.base_price)
