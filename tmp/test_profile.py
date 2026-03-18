import asyncio
import os
import sys
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath("."))
from app.models.user import User, UserRole
from app.models.profile import BuyerProfile, SellerProfile, AgencyProfile

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def test_roles():
    load_dotenv("apps/api/.env")
    db_url = os.getenv("DATABASE_URL")
    engine = create_async_engine(db_url)
    
    async with AsyncSession(engine) as session:
        # Get a user or create one
        res = await session.execute(select(User).limit(1))
        user = res.scalars().first()
        if not user:
            user = User(telegram_id=12345, full_name="Test")
            session.add(user)
            await session.flush()
            print("Created random user:", user.id)
            
        print("Testing with User:", user.id)
        
        # Test Buyer Profile Logic
        res = await session.execute(select(UserRole).filter(UserRole.user_id == user.id, UserRole.role == "buyer"))
        role = res.scalars().first()
        if not role:
            session.add(UserRole(user_id=user.id, role="buyer"))
            
        res = await session.execute(select(BuyerProfile).filter(BuyerProfile.user_id == user.id))
        prof = res.scalars().first()
        if not prof:
            prof = BuyerProfile(user_id=user.id)
            session.add(prof)
            
        try:
            await session.commit()
            print("Successfully committed Buyer Profile!")
        except Exception as e:
            await session.rollback()
            print("Failed to commit Buyer Profile:", e)

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_roles())
