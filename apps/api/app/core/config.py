from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os
from dotenv import load_dotenv

# Explicitly load .env from the app root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

class Settings(BaseSettings):
    PROJECT_NAME: str = "MIDAS API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:password@localhost:5432/midas")
    
    # Supabase (optional for API, but present in .env)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Telegram
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()
