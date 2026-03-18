from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import asyncio
import os
from dotenv import load_dotenv

async def check():
    db_url = "postgresql+psycopg://postgres.oetpiybbjbhzhubeynqt:h8tYgFMwmQ3eTgiV@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
    print(f"Connecting to: {db_url}")
    
    engine = create_async_engine(db_url)
    async with AsyncSession(engine) as session:
        from app.models.inventory import MediaAsset
        count = (await session.execute(select(func.count()).select_from(MediaAsset))).scalar()
        print(f"Media Assets count: {count}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check())
