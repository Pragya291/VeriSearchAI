import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    """
    APP_NAME: str = "Autonomous Research & Fact-Checking Agent"
    ENV: str = "development"
    DEBUG: bool = True
    
    # API Keys
    GEMINI_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None

    # Authentication
    AUTH_DATABASE_PATH: Optional[str] = None
    AUTH_SESSION_DAYS: int = 14
    AUTH_COOKIE_NAME: str = "verisearchai_session"
    AUTH_COOKIE_SECURE: bool = False
    
    # Firebase Settings
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    FIREBASE_CREDENTIALS_FILE: Optional[str] = None
    
    # CORS Settings
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        """
        Parse allowed origins into a list for FastAPI CORS Middleware.
        """
        origins = [
            self.FRONTEND_URL.strip(),
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
        ]
        if self.ALLOWED_ORIGINS:
            for item in self.ALLOWED_ORIGINS.split(","):
                item_clean = item.strip()
                if item_clean and item_clean not in origins:
                    origins.append(item_clean)
        return list(set(origins))


settings = Settings()
