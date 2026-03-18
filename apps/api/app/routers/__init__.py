from fastapi import APIRouter
from app.routers import auth, users, companies, profiles, inventory, discovery, shortlist, offers, deals, chats

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(discovery.router, prefix="/discovery", tags=["discovery"])
api_router.include_router(shortlist.router, prefix="/shortlist", tags=["shortlist"])
api_router.include_router(offers.router, prefix="/offers", tags=["offers"])
api_router.include_router(deals.router, prefix="/deals", tags=["deals"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
