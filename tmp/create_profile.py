from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
import asyncio
import os
import uuid
from dotenv import load_dotenv
from app.models.user import User
from app.models.profile import SellerProfile

import sys
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def create_profile():
    load_dotenv("apps/api/.env")
    db_url = os.getenv("DATABASE_URL")
    engine = create_async_engine(db_url)
    
    async with AsyncSession(engine) as session:
        # Get or create a test user
        res = await session.execute(select(User).limit(1))
        user = res.scalars().first()
        if not user:
            print("Creating test user...")
            user = User(
                email="test@example.com",
                hashed_password="hashed",
                full_name="Test User",
                is_active=True
            )
            session.add(user)
            await session.flush()
        
        # Check if profile exists
        res = await session.execute(select(SellerProfile).filter(SellerProfile.user_id == user.id))
        profile = res.scalars().first()
        if not profile:
            print("Creating seller profile...")
            profile = SellerProfile(
                user_id=user.id,
                display_name="Test Agency",
                bio="A test agency for verification."
            )
            session.add(profile)
        
        await session.commit()
        print(f"Profile ready: {profile.display_name}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(create_profile())
