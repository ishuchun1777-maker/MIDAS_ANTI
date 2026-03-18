from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User, UserRole
from app.models.profile import BuyerProfile, SellerProfile, SpecialistProfile

router = APIRouter()

@router.post("/buyer")
async def create_buyer_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Roli bor-yo'qligini tekshirish
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "buyer"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="buyer"))
    
    # Profili bormi
    result = await db.execute(select(BuyerProfile).filter(BuyerProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = BuyerProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        
    return {"status": "success", "buyer_profile_id": str(profile.id)}

@router.post("/seller")
async def create_seller_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "seller"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="seller"))
        
    result = await db.execute(select(SellerProfile).filter(SellerProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = SellerProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        
    return {"status": "success", "seller_profile_id": str(profile.id)}

@router.post("/specialist")
async def create_specialist_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "specialist"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="specialist"))
        
    result = await db.execute(select(SpecialistProfile).filter(SpecialistProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = SpecialistProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        
    return {"status": "success", "specialist_profile_id": str(profile.id)}

@router.get("/me")
async def get_my_profiles(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch all profiles
    b_res = await db.execute(select(BuyerProfile).filter(BuyerProfile.user_id == current_user.id))
    s_res = await db.execute(select(SellerProfile).filter(SellerProfile.user_id == current_user.id))
    sp_res = await db.execute(select(SpecialistProfile).filter(SpecialistProfile.user_id == current_user.id))
    
    buyer = b_res.scalars().first()
    seller = s_res.scalars().first()
    spec = sp_res.scalars().first()
    
    return {
        "buyer_profile_id": str(buyer.id) if buyer else None,
        "seller_profile_id": str(seller.id) if seller else None,
        "specialist_profile_id": str(spec.id) if spec else None,
    }
