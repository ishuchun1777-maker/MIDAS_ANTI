import hashlib
import hmac
import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.models.user import User, UserRole
from app.schemas.user import Token, LoginCredentials, TelegramLoginData

router = APIRouter()
logger = logging.getLogger(__name__)

def verify_telegram_authorization(data: TelegramLoginData) -> bool:
    """
    Telegram WebApp initData hash tekshiruvi.
    WebApp uchun secret_key = HMAC-SHA256("WebAppData", bot_token)
    """
    received_hash = data.hash
    if not received_hash:
        return False

    fields = {
        "id": data.id,
        "first_name": data.first_name,
        "last_name": data.last_name,
        "username": data.username,
        "photo_url": data.photo_url,
        "auth_date": data.auth_date,
    }

    # None va bo'sh stringlarni o'chirish
    data_check_arr = [
        f"{k}={v}" for k, v in fields.items()
        if v is not None and v != ""
    ]

    data_check_string = "\n".join(sorted(data_check_arr))
    logger.info(f"Hash check fields: {sorted([f.split('=')[0] for f in data_check_arr])}")

    # Telegram WebApp uchun to'g'ri usul
    secret_key = hmac.new(
        b"WebAppData",
        settings.TELEGRAM_BOT_TOKEN.encode(),
        hashlib.sha256
    ).digest()

    hash_calc = hmac.new(
        secret_key,
        msg=data_check_string.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()

    logger.info(f"Expected: {hash_calc[:10]}..., Received: {received_hash[:10]}...")
    logger.info(f"Hash match: {hash_calc == received_hash}")

    return hash_calc == received_hash


@router.post("/login", response_model=Token)
async def login(credentials: LoginCredentials, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == credentials.email))
    user = result.scalars().first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }


@router.post("/telegram", response_model=Token)
async def telegram_login(data: TelegramLoginData, db: AsyncSession = Depends(get_db)):
    logger.info(f"Telegram login: id={data.id}, first_name={data.first_name}, auth_date={data.auth_date}")

    if not verify_telegram_authorization(data):
        logger.warning(f"Hash verification FAILED for telegram_id={data.id}")
        raise HTTPException(status_code=400, detail="Data is NOT from Telegram")

    result = await db.execute(select(User).filter(User.telegram_id == data.id))
    user = result.scalars().first()

    if not user:
        user = User(
            telegram_id=data.id,
            full_name=f"{data.first_name} {data.last_name or ''}".strip(),
            avatar_url=data.photo_url,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }


@router.post("/dev-login", response_model=Token)
async def dev_login(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found in database")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }
