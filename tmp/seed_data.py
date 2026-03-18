from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
import asyncio
import os
import uuid
from dotenv import load_dotenv
from app.models.inventory import MediaAsset, MediaAssetPricing, MediaAssetRegion, MediaAssetAudience
from app.models.profile import SellerProfile

import sys
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def seed():
    load_dotenv("apps/api/.env")
    db_url = os.getenv("DATABASE_URL")
    engine = create_async_engine(db_url)
    
    async with AsyncSession(engine) as session:
        # Get or create a seller profile
        res = await session.execute(select(SellerProfile).limit(1))
        profile = res.scalars().first()
        if not profile:
            print("No seller profile found. Please create one first.")
            return

        # Create a test asset
        asset = MediaAsset(
            seller_profile_id=profile.id,
            media_type="telegram_channel",
            title="Test Tech Channel",
            description="A premium technology channel for testing.",
            category="Technology",
            visibility="public",
            status="published"
        )
        session.add(asset)
        await session.flush()

        # Add region
        region = MediaAssetRegion(media_asset_id=asset.id, city="Tashkent", country_code="UZ")
        session.add(region)

        # Add pricing
        pricing = MediaAssetPricing(
            media_asset_id=asset.id,
            pricing_model="cpm",
            base_price=50.0
        )
        session.add(pricing)

        # Add audience
        audience = MediaAssetAudience(
            media_asset_id=asset.id,
            total_reach=15000,
            avg_engagement_rate=4.5
        )
        session.add(audience)

        await session.commit()
        print(f"Seeded asset: {asset.title}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
