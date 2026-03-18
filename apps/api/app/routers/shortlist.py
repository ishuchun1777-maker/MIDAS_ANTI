from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.inventory import Shortlist, MediaAsset
from app.schemas.inventory import ShortlistCreate, ShortlistResponse

router = APIRouter()

@router.post("/", response_model=ShortlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_shortlist(
    shortlist_in: ShortlistCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if asset exists
    asset = await db.get(MediaAsset, shortlist_in.media_asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Check if already shortlisted
    stmt = select(Shortlist).filter(
        Shortlist.user_id == current_user.id,
        Shortlist.media_asset_id == shortlist_in.media_asset_id
    )
    existing = (await db.execute(stmt)).scalar()
    if existing:
        return existing

    new_shortlist = Shortlist(
        user_id=current_user.id,
        media_asset_id=shortlist_in.media_asset_id
    )
    db.add(new_shortlist)
    await db.commit()
    await db.refresh(new_shortlist)
    
    # Reload with asset info
    stmt = select(Shortlist).options(selectinload(Shortlist.media_asset)).filter(Shortlist.id == new_shortlist.id)
    result = await db.execute(stmt)
    return result.scalars().first()

@router.get("/", response_model=List[ShortlistResponse])
async def get_my_shortlist(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Shortlist)
        .options(selectinload(Shortlist.media_asset))
        .filter(Shortlist.user_id == current_user.id)
        .order_by(Shortlist.created_at.desc())
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_shortlist(
    asset_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Shortlist).filter(
        Shortlist.user_id == current_user.id,
        Shortlist.media_asset_id == asset_id
    )
    shortlist_item = (await db.execute(stmt)).scalar()
    if not shortlist_item:
        raise HTTPException(status_code=404, detail="Item not in shortlist")
        
    await db.delete(shortlist_item)
    await db.commit()
    return None
