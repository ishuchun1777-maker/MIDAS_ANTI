from fastapi import APIRouter
router = APIRouter()

@router.post("/buyer")
async def create_buyer_profile():
    return {"status": "success"}

@router.post("/seller")
async def create_seller_profile():
    return {"status": "success"}

@router.post("/specialist")
async def create_specialist_profile():
    return {"status": "success"}

@router.get("/me")
async def get_my_profiles():
    return {}
