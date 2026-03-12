from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database - PostgreSQL (chuyển từ SQL Server sang PostgreSQL cho Railway)
    DATABASE_URL: str = "postgresql://postgres:123@localhost:5432/HeThongBanCayCanh"
    
    # JWT Settings
    SECRET_KEY: str = "CHANGE-THIS-SECRET-KEY-IN-PRODUCTION"  # Phải đổi trong .env!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # App Settings
    APP_NAME: str = "CayCanhShop API"
    DEBUG: bool = False
    
    # File Upload
    UPLOAD_DIR: str = "static/images"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
