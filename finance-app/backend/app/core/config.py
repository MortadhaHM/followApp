"""
Application configuration loaded from environment variables (.env file).
Centralizes database URL, JWT settings, and token expiration.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Always load .env from the backend folder, regardless of where the command is run from
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    """Reads config from .env so secrets are not hard-coded in source files."""

    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
    )


# Single shared settings instance used across the app
settings = Settings()
