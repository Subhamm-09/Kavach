"""Kavach Application Configuration."""

import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_DATA_DIR = PROJECT_ROOT / "data"

class Settings(BaseSettings):
    # App
    APP_NAME: str = "KAVACH Agentic Safety Platform"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Security & Auth
    SECRET_KEY: str = "kavach_super_secret_jwt_key_change_in_production_2026_agentic"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DATA_DIR / 'kavach.db'}"

    # ChromaDB Vector Store
    CHROMA_PERSIST_DIRECTORY: str = str(DEFAULT_DATA_DIR / "chroma")
    LEGAL_DOCUMENTS_DIR: str = str(DEFAULT_DATA_DIR / "legal_documents")

    # AI / Gemini
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Proximity & Risk Thresholds
    PROXIMITY_WARNING_DISTANCE_METERS: float = 150.0
    HIGH_RISK_DISTANCE_METERS: float = 80.0
    CORROBORATION_THRESHOLD: int = 3
    MATCH_SIMILARITY_THRESHOLD: float = 0.65
    GPS_SIMULATION_INTERVAL_MS: int = 1200

    # Seed Authority Account (fictional)
    AUTHORITY_DEMO_EMAIL: str = "inspector.patnaik@odishapolice.gov.in"
    AUTHORITY_DEMO_PASSWORD: str = "KavachShield@2026"
    AUTHORITY_DEMO_NAME: str = "Insp. R. K. Patnaik (Bhubaneswar Cyber Cell)"

    # Seed User Account (fictional)
    USER_DEMO_EMAIL: str = "priya.sharma@example.com"
    USER_DEMO_PASSWORD: str = "PriyaKavach@2026"
    USER_DEMO_NAME: str = "Priya Sharma"

    # Bhubaneswar Center Coordinates
    BHUBANESWAR_CENTER_LAT: float = 20.2961
    BHUBANESWAR_CENTER_LNG: float = 85.8245

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

# Ensure directories exist
os.makedirs(os.path.dirname(settings.DATABASE_URL.replace("sqlite:///", "")), exist_ok=True)
os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
os.makedirs(settings.LEGAL_DOCUMENTS_DIR, exist_ok=True)
