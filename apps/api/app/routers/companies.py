from fastapi import APIRouter
router = APIRouter()

@router.post("")
async def create_company():
    return {"status": "success", "message": "Company created"}

@router.get("/me")
async def get_my_companies():
    return []

@router.post("/{id}/members")
async def add_company_member(id: str):
    return {"status": "success"}
