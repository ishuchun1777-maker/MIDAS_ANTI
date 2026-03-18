from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_, func
from sqlalchemy.orm import selectinload, joinedload
from typing import Optional, List
from uuid import UUID

from app.core.database import get_db
from app.models.inventory import MediaAsset, MediaAssetRegion, MediaAssetPricing, MediaAssetAudience
from app.models.profile import SellerProfile
from app.schemas.inventory import DiscoveryPaginatedResponse, DiscoveryAssetResponse

router = APIRouter()

@router.get("/assets", response_model=DiscoveryPaginatedResponse)
async def get_discovery_assets(
    query: Optional[str] = Query(None),
    media_type: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    age_min: Optional[int] = Query(None),
    age_max: Optional[int] = Query(None),
    engagement_rate_min: Optional[float] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    # Base query for public/published assets
    stmt = (
        select(MediaAsset)
        .options(
            joinedload(MediaAsset.seller_profile),
            joinedload(MediaAsset.pricing),
            joinedload(MediaAsset.regions),
            joinedload(MediaAsset.audience)
        )
        .filter(MediaAsset.visibility == "public")
        .filter(MediaAsset.status == "published") # Only published assets in discovery
    )

    # Search Query
    if query:
        search_filter = or_(
            MediaAsset.title.ilike(f"%{query}%"),
            MediaAsset.description.ilike(f"%{query}%"),
            MediaAsset.category.ilike(f"%{query}%")
        )
        stmt = stmt.filter(search_filter)

    # Filters
    if media_type:
        stmt = stmt.filter(MediaAsset.media_type == media_type)
    
    if city:
        stmt = stmt.join(MediaAssetRegion).filter(MediaAssetRegion.city.ilike(f"%{city}%"))
        
    if price_min is not None or price_max is not None:
        if not any(isinstance(c.entity, type) and c.entity == MediaAssetPricing for c in stmt.get_final_join_entities()):
            stmt = stmt.join(MediaAssetPricing)
        if price_min is not None:
            stmt = stmt.filter(MediaAssetPricing.base_price >= price_min)
        if price_max is not None:
            stmt = stmt.filter(MediaAssetPricing.base_price <= price_max)

    if engagement_rate_min:
        stmt = stmt.join(MediaAssetAudience).filter(MediaAssetAudience.avg_engagement_rate >= engagement_rate_min)

    try:
        # Count total for pagination (clean total count without joinedloads)
        count_stmt = select(func.count(MediaAsset.id)).filter(MediaAsset.visibility == "public").filter(MediaAsset.status == "published")
        
        # Apply same filters to count
        if query:
            search_filter = or_(
                MediaAsset.title.ilike(f"%{query}%"),
                MediaAsset.description.ilike(f"%{query}%"),
                MediaAsset.category.ilike(f"%{query}%")
            )
            count_stmt = count_stmt.filter(search_filter)
        
        if media_type:
            count_stmt = count_stmt.filter(MediaAsset.media_type == media_type)

        if city:
            count_stmt = count_stmt.join(MediaAssetRegion).filter(MediaAssetRegion.city.ilike(f"%{city}%"))

        total_count = (await db.execute(count_stmt)).scalar()

        # Apply pagination and sorting
        stmt = stmt.order_by(MediaAsset.created_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        
        result = await db.execute(stmt)
        assets = result.unique().scalars().all()

        # Transform to DiscoveryAssetResponse
        discovery_results = []
        for asset in assets:
            # Get primary price
            base_price = asset.pricing[0].base_price if asset.pricing else None
            # Get primary city
            city_name = asset.regions[0].city if asset.regions else None
            
            discovery_results.append(
                DiscoveryAssetResponse(
                    id=asset.id,
                    title=asset.title,
                    media_type=asset.media_type,
                    category=asset.category,
                    seller_name=asset.seller_profile.display_name if asset.seller_profile else "Anonymous",
                    base_price=base_price,
                    city=city_name,
                    audience_reach=asset.audience.total_reach if asset.audience else None,
                    engagement_rate=asset.audience.avg_engagement_rate if asset.audience else None,
                    thumbnail_url=None
                )
            )

        return DiscoveryPaginatedResponse(
            total_count=total_count,
            page=page,
            page_size=page_size,
            results=discovery_results
        )
    except Exception as e:
        print(f"Discovery Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Discovery system error: {str(e)}")
