import asyncio
import os
import sys
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from dotenv import load_dotenv

# App imports
sys.path.append("apps/api")
from app.models.inventory import MediaAsset, MediaAssetPricing, MediaAssetRegion

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def audit():
    load_dotenv("apps/api/.env")
    db_url = os.getenv("DATABASE_URL")
    print(f"Checking DB: {db_url.split('@')[-1]}") # Print host only for safety
    
    engine = create_async_engine(db_url)
    async with AsyncSession(engine) as session:
        # Check all assets
        res = await session.execute(select(MediaAsset))
        assets = res.scalars().all()
        print(f"Total Assets in DB: {len(assets)}")
        for a in assets:
            print(f"- ID: {a.id}, Title: {a.title}, Status: {a.status}, Visibility: {a.visibility}")
            
        # Check public/published count
        res = await session.execute(
            select(func.count(MediaAsset.id))
            .filter(MediaAsset.visibility == "public")
            .filter(MediaAsset.status == "published")
        )
        count = res.scalar()
        print(f"Public & Published Assets count: {count}")
        
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(audit())
