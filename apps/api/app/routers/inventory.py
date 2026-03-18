from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.profile import SellerProfile
from app.models.inventory import MediaAsset
from app.schemas.inventory import MediaAssetCreate, MediaAssetUpdate, MediaAssetResponse

router = APIRouter()

@router.post("/assets", response_model=MediaAssetResponse)
async def create_asset(
    asset_in: MediaAssetCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify the seller profile belongs to the current user
    result = await db.execute(
        select(SellerProfile).filter(
            SellerProfile.id == asset_in.seller_profile_id,
            SellerProfile.user_id == current_user.id
        )
    )
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=403, detail="Not authorized or invalid seller profile")

    db_asset = MediaAsset(**asset_in.model_dump())
    db.add(db_asset)
    await db.commit()
    await db.refresh(db_asset)
    return db_asset

@router.get("/assets/mine", response_model=list[MediaAssetResponse])
async def get_my_assets(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Find user's seller profile
    result = await db.execute(select(SellerProfile).filter(SellerProfile.user_id == current_user.id))
    profile = result.scalars().first()
    if not profile:
        return []

    assets_result = await db.execute(
        select(MediaAsset)
        .options(
            selectinload(MediaAsset.regions),
            selectinload(MediaAsset.formats),
            selectinload(MediaAsset.pricing),
            selectinload(MediaAsset.audience),
            selectinload(MediaAsset.social_details),
            selectinload(MediaAsset.outdoor_details),
            selectinload(MediaAsset.files),
            selectinload(MediaAsset.availability)
        )
        .filter(MediaAsset.seller_profile_id == profile.id)
        .order_by(MediaAsset.created_at.desc())
    )
    return assets_result.scalars().all()

@router.get("/assets/{asset_id}", response_model=MediaAssetResponse)
async def get_asset(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MediaAsset)
        .options(
            selectinload(MediaAsset.regions),
            selectinload(MediaAsset.formats),
            selectinload(MediaAsset.pricing),
            selectinload(MediaAsset.audience),
            selectinload(MediaAsset.social_details),
            selectinload(MediaAsset.outdoor_details),
            selectinload(MediaAsset.files),
            selectinload(MediaAsset.availability)
        )
        .filter(MediaAsset.id == asset_id)
    )
    asset = result.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.patch("/assets/{asset_id}", response_model=MediaAssetResponse)
async def update_asset(
    asset_id: UUID,
    asset_update: MediaAssetUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MediaAsset)
        .options(selectinload(MediaAsset.seller_profile))
        .filter(MediaAsset.id == asset_id)
    )
    asset = result.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    if asset.seller_profile.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this asset")

    update_data = asset_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(asset, field, value)
        
    await db.commit()
    
    # Reload with all relations
    result = await db.execute(
        select(MediaAsset)
        .options(
            selectinload(MediaAsset.regions),
            selectinload(MediaAsset.formats),
            selectinload(MediaAsset.pricing),
            selectinload(MediaAsset.audience),
            selectinload(MediaAsset.social_details),
            selectinload(MediaAsset.outdoor_details),
            selectinload(MediaAsset.files),
            selectinload(MediaAsset.availability)
        )
        .filter(MediaAsset.id == asset_id)
    )
    return result.scalars().first()

@router.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MediaAsset)
        .options(selectinload(MediaAsset.seller_profile))
        .filter(MediaAsset.id == asset_id)
    )
    asset = result.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    if asset.seller_profile.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this asset")

    await db.delete(asset)
    await db.commit()
    return None
