from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database - SQL Server (giữ nguyên DB cũ)
    DB_SERVER: str = "localhost"
    DB_NAME: str = "HeThongBanCayCanh"
    DB_USER: str = "sa"
    DB_PASSWORD: str = "123"
    DB_DRIVER: str = "ODBC Driver 17 for SQL Server"
    
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
    
    @property
    def DATABASE_URL(self) -> str:
        # SQL Server Authentication (hoạt động trên cả Windows lẫn Docker/Linux)
        return (
            f"mssql+pyodbc://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_SERVER}/{self.DB_NAME}?"
            f"driver={self.DB_DRIVER.replace(' ', '+')}&TrustServerCertificate=yes"
        )
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
