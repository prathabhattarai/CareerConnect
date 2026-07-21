import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "CareerConnect"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/careerconnect"
    JWT_SECRET_KEY: str = "your-super-secret-key-change-in-production-2024"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024
    ALLOWED_RESUME_EXTENSIONS: list = ["pdf", "doc", "docx"]
    ALLOWED_LOGO_EXTENSIONS: list = ["png", "jpg", "jpeg", "gif", "svg"]
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
