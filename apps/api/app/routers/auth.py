import hashlib
import hmac
import logging
from datetime import timedelta
from urllib.parse import unquote, parse_qsl
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.models.user import User
from app.schemas.user import Token, LoginCredentials, TelegramLoginData

router = APIRouter()
logger = logging.getLogger(__name__)


class TelegramInitData(BaseModel):
    """Raw initData string from Telegram WebApp"""
    init_data: str


def verify_webapp_init_data(init_data: str) -> dict | None:
    """
    Telegram WebApp initData ni to'g'ri tekshiradi.
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    """
    try:
        parsed = dict(parse_qsl(init_data, keep_blank_values=True))
        received_hash = parsed.pop("hash", None)
        if not received_hash:
            logger.warning("No hash in initData")
            return None

        # Data check string - barcha fieldlar sorted va newline bilan
        data_check_string = "\n".join(
            f"{k}={v}" for k, v in sorted(parsed.items())
        )
        logger.info(f"Data check string keys: {sorted(parsed.keys())}")

        # WebApp uchun to'g'ri secret key
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

        logger.info(f"Hash match: {hash_calc == received_hash}")

        if hash_calc != received_hash:
            return None

        # user field'ini parse qilamiz
        import json
        user_str = parsed.get("user", "{}")
        user = json.loads(unquote(user_str))
        return {
            "user": user,
            "auth_date": parsed.get("auth_date"),
        }
    except Exception as e:
        logger.error(f"initData parse error: {e}")
        return None


def verify_telegram_authorization(data: TelegramLoginData) -> bool:
    """
    Eski usul - faqat parsed fieldlar bilan (fallback)
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

    data_check_arr = [
        f"{k}={v}" for k, v in fields.items()
        if v is not None and v != ""
    ]
    data_check_string = "\n".join(sorted(data_check_arr))

    # WebApp secret key
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

    logger.info(f"Fallback hash match: {hash_calc == received_hash}")
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


@router.post("/telegram-webapp", response_model=Token)
async def telegram_webapp_login(body: TelegramInitData, db: AsyncSession = Depends(get_db)):
    """Raw initData bilan login - eng ishonchli usul"""
    logger.info("Telegram WebApp login attempt with raw initData")

    result = verify_webapp_init_data(body.init_data)
    if not result:
        raise HTTPException(status_code=400, detail="Invalid Telegram WebApp data")

    user_data = result["user"]
    telegram_id = user_data.get("id")

    if not telegram_id:
        raise HTTPException(status_code=400, detail="No user ID in initData")

    db_result = await db.execute(select(User).filter(User.telegram_id == telegram_id))
    user = db_result.scalars().first()

    if not user:
        user = User(
            telegram_id=telegram_id,
            full_name=f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip(),
            avatar_url=user_data.get("photo_url"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }


@router.post("/telegram", response_model=Token)
async def telegram_login(data: TelegramLoginData, db: AsyncSession = Depends(get_db)):
    """Parsed fields bilan login"""
    logger.info(f"Telegram login: id={data.id}, auth_date={data.auth_date}")

    if not verify_telegram_authorization(data):
        logger.warning(f"Hash FAILED for telegram_id={data.id}")
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
