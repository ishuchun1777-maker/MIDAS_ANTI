from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.offer import Offer
from app.models.deal import Deal
from app.models.user import User
from app.models.inventory import MediaAsset
from app.schemas.offer import OfferCreate, OfferUpdate, OfferResponse
from app.core.security import get_current_user

router = APIRouter()

router = APIRouter()

@router.post("/", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
async def create_offer(
    offer_in: OfferCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == offer_in.receiver_user_id:
        raise HTTPException(
            status_code=400,
            detail="Cannot send an offer to yourself"
        )
        
    db_offer = Offer(
        **offer_in.model_dump(),
        sender_user_id=current_user.id,
        status="pending"
    )
    db.add(db_offer)
    await db.commit()
    await db.refresh(db_offer)
    return db_offer

@router.get("/", response_model=List[OfferResponse])
async def get_my_offers(
    type: str = "all", # 'sent' or 'received' or 'all'
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if type == "sent":
        query = select(Offer).where(Offer.sender_user_id == current_user.id)
    elif type == "received":
        query = select(Offer).where(Offer.receiver_user_id == current_user.id)
    else:
        query = select(Offer).where(
            (Offer.sender_user_id == current_user.id) | 
            (Offer.receiver_user_id == current_user.id)
        )
        
    result = await db.execute(query)
    offers = result.scalars().all()
    return offers

@router.get("/{offer_id}", response_model=OfferResponse)
async def get_offer(
    offer_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Offer).where(Offer.id == offer_id)
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    if offer.sender_user_id != current_user.id and offer.receiver_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return offer

@router.patch("/{offer_id}", response_model=OfferResponse)
async def update_offer(
    offer_id: UUID,
    offer_update: OfferUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Offer).where(Offer.id == offer_id)
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    if offer.sender_user_id != current_user.id and offer.receiver_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    update_data = offer_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(offer, field, value)
        
    await db.commit()
    await db.refresh(offer)
    return offer

@router.patch("/{offer_id}/accept", response_model=OfferResponse)
async def accept_offer(
    offer_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Offer).where(Offer.id == offer_id)
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    if offer.receiver_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to accept this offer")
        
    if offer.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending offers can be accepted")
        
    # Mark offer as accepted
    offer.status = "accepted"
    
    # Create Deal
    new_deal = Deal(
        offer_id=offer.id,
        media_asset_id=offer.media_asset_id,
        buyer_id=offer.sender_user_id,
        seller_id=offer.receiver_user_id,
        price=offer.price,
        status="IN_PROGRESS"
    )
    db.add(new_deal)
    await db.commit()
    
    await db.refresh(offer)
    return offer

@router.patch("/{offer_id}/reject", response_model=OfferResponse)
async def reject_offer(
    offer_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Offer).where(Offer.id == offer_id)
    result = await db.execute(query)
    offer = result.scalar_one_or_none()
    
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    if offer.receiver_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to reject this offer")
        
    if offer.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending offers can be rejected")
        
    offer.status = "rejected"
    await db.commit()
    await db.refresh(offer)
    
    return offer
