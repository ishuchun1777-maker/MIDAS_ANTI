from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User, UserRole
from app.models.user import User, UserRole
from app.models.profile import BuyerProfile, SellerProfile, SpecialistProfile, AgencyProfile

router = APIRouter()

@router.post("/buyer")
async def create_buyer_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    changes = False
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "buyer"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="buyer"))
        changes = True
    
    result = await db.execute(select(BuyerProfile).filter(BuyerProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = BuyerProfile(user_id=current_user.id)
        db.add(profile)
        changes = True
        
    if changes:
        try:
            await db.commit()
            if not profile.id: # needed if freshly added
                await db.refresh(profile)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        
    return {"status": "success", "buyer_profile_id": str(profile.id)}

@router.post("/seller")
async def create_seller_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    changes = False
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "seller"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="seller"))
        changes = True
        
    result = await db.execute(select(SellerProfile).filter(SellerProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = SellerProfile(user_id=current_user.id)
        db.add(profile)
        changes = True
        
    if changes:
        try:
            await db.commit()
            if not profile.id:
                await db.refresh(profile)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        
    return {"status": "success", "seller_profile_id": str(profile.id)}

@router.post("/specialist")
async def create_specialist_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    changes = False
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "specialist"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="specialist"))
        changes = True
        
    result = await db.execute(select(SpecialistProfile).filter(SpecialistProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = SpecialistProfile(user_id=current_user.id)
        db.add(profile)
        changes = True
        
    if changes:
        try:
            await db.commit()
            if not profile.id:
                await db.refresh(profile)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        
    return {"status": "success", "specialist_profile_id": str(profile.id)}

@router.post("/agency")
async def create_agency_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    changes = False
    result = await db.execute(select(UserRole).filter(UserRole.user_id == current_user.id, UserRole.role == "agency"))
    existing_role = result.scalars().first()
    
    if not existing_role:
        db.add(UserRole(user_id=current_user.id, role="agency"))
        changes = True
        
    result = await db.execute(select(AgencyProfile).filter(AgencyProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = AgencyProfile(user_id=current_user.id)
        db.add(profile)
        changes = True
        
    if changes:
        try:
            await db.commit()
            if not profile.id:
                await db.refresh(profile)
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        
    return {"status": "success", "agency_profile_id": str(profile.id)}

@router.get("/me")
async def get_my_profiles(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch all profiles
    b_res = await db.execute(select(BuyerProfile).filter(BuyerProfile.user_id == current_user.id))
    s_res = await db.execute(select(SellerProfile).filter(SellerProfile.user_id == current_user.id))
    sp_res = await db.execute(select(SpecialistProfile).filter(SpecialistProfile.user_id == current_user.id))
    ag_res = await db.execute(select(AgencyProfile).filter(AgencyProfile.user_id == current_user.id))
    
    buyer = b_res.scalars().first()
    seller = s_res.scalars().first()
    spec = sp_res.scalars().first()
    agency = ag_res.scalars().first()
    
    return {
        "buyer_profile_id": str(buyer.id) if buyer else None,
        "seller_profile_id": str(seller.id) if seller else None,
        "specialist_profile_id": str(spec.id) if spec else None,
        "agency_profile_id": str(agency.id) if agency else None,
    }
