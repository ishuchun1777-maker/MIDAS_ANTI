import re
from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime, date

def sanitize_text(v: Any) -> Any:
    if isinstance(v, str):
        return re.sub(r'<[^>]*?>', '', v)
    return v

class MediaAssetRegionBase(BaseModel):

    country_code: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

class MediaAssetRegionResponse(MediaAssetRegionBase):
    id: UUID
    media_asset_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MediaAssetFormatBase(BaseModel):
    format_name: str
    duration_seconds: Optional[int] = None
    quantity_limit: Optional[int] = None
    creative_requirements: Optional[str] = None
    is_active: bool = True

class MediaAssetFormatResponse(MediaAssetFormatBase):
    id: UUID
    media_asset_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MediaAssetPricingBase(BaseModel):
    pricing_model: str
    currency: str = "USD"
    base_price: float
    min_order_value: Optional[float] = None
    negotiable: bool = False
    valid_from: Optional[date] = None
    valid_to: Optional[date] = None

class MediaAssetPricingResponse(MediaAssetPricingBase):
    id: UUID
    media_asset_id: UUID
    created_at: datetime
    updated_at: datetime
    format_id: Optional[UUID] = None
    model_config = ConfigDict(from_attributes=True)

class MediaAssetAudienceBase(BaseModel):
    total_reach: Optional[int] = None
    avg_views: Optional[int] = None
    avg_engagement_rate: Optional[float] = None
    male_percent: Optional[float] = None
    female_percent: Optional[float] = None
    age_13_17: Optional[float] = None
    age_18_24: Optional[float] = None
    age_25_34: Optional[float] = None
    age_35_44: Optional[float] = None
    age_45_plus: Optional[float] = None
    top_cities: List[Any] = []
    top_interests: List[Any] = []

class MediaAssetAudienceResponse(MediaAssetAudienceBase):
    id: UUID
    media_asset_id: UUID
    audience_quality_score: float
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MediaAssetSocialDetailsBase(BaseModel):
    followers: Optional[int] = None
    subscribers: Optional[int] = None
    avg_story_views: Optional[int] = None
    avg_post_views: Optional[int] = None
    avg_video_views: Optional[int] = None
    avg_comments: Optional[int] = None
    avg_shares: Optional[int] = None
    growth_rate: Optional[float] = None

class MediaAssetSocialDetailsResponse(MediaAssetSocialDetailsBase):
    id: UUID
    media_asset_id: UUID
    authenticity_score: float
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MediaAssetOutdoorDetailsBase(BaseModel):
    width_m: Optional[float] = None
    height_m: Optional[float] = None
    resolution: Optional[str] = None
    screen_type: Optional[str] = None
    daily_traffic_estimate: Optional[int] = None
    visibility_score: Optional[float] = None
    illumination: Optional[bool] = None
    landmark_info: Optional[str] = None
    facing_direction: Optional[str] = None
    installation_type: Optional[str] = None

class MediaAssetOutdoorDetailsResponse(MediaAssetOutdoorDetailsBase):
    id: UUID
    media_asset_id: UUID
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class MediaAssetBase(BaseModel):
    media_type: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    social_link: Optional[str] = None
    visibility: str = "public"
    status: str = "draft"
    public_slug: Optional[str] = None

    @field_validator("title", "description", "category", "social_link", "public_slug")
    @classmethod
    def sanitize_fields(cls, v: Any) -> Any:
        return sanitize_text(v)

class MediaAssetCreate(MediaAssetBase):
    seller_profile_id: UUID
    company_id: Optional[UUID] = None

class MediaAssetUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    social_link: Optional[str] = None
    visibility: Optional[str] = None
    status: Optional[str] = None
    public_slug: Optional[str] = None

class MediaAssetResponse(MediaAssetBase):
    id: UUID
    seller_profile_id: UUID
    company_id: Optional[UUID] = None
    verification_status: str
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    # Includes relationships
    regions: List[MediaAssetRegionResponse] = []
    formats: List[MediaAssetFormatResponse] = []
    pricing: List[MediaAssetPricingResponse] = []
    audience: Optional[MediaAssetAudienceResponse] = None
    social_details: Optional[MediaAssetSocialDetailsResponse] = None
    outdoor_details: Optional[MediaAssetOutdoorDetailsResponse] = None
    
    model_config = ConfigDict(from_attributes=True)

class DiscoveryAssetResponse(BaseModel):
    id: UUID
    title: str
    media_type: str
    category: Optional[str] = None
    seller_name: Optional[str] = None  # Aggregated from seller_profile
    base_price: Optional[float] = None # From pricing relationship
    city: Optional[str] = None        # From regions relationship
    audience_reach: Optional[int] = None # From audience relationship
    engagement_rate: Optional[float] = None # From audience relationship
    thumbnail_url: Optional[str] = None # First file if available
    
    model_config = ConfigDict(from_attributes=True)

class DiscoveryPaginatedResponse(BaseModel):
    total_count: int
    page: int
    page_size: int
    results: List[DiscoveryAssetResponse]

class ShortlistCreate(BaseModel):
    media_asset_id: UUID

class ShortlistResponse(BaseModel):
    id: UUID
    media_asset_id: UUID
    user_id: UUID
    created_at: datetime
    asset: Optional[MediaAssetResponse] = None
    
    model_config = ConfigDict(from_attributes=True)
