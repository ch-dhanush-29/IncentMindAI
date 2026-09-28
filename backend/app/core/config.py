import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "IncidentMind AI"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    
    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "incidentmind_db"
    
    # Hindsight Memory Configuration
    HINDSIGHT_API_KEY: Optional[str] = None
    HINDSIGHT_BASE_URL: str = "https://api.hindsight.vectorize.io"
    HINDSIGHT_BANK_ID: str = "incidentmind-prod-bank"
    HINDSIGHT_ENABLED: bool = True
    
    # Groq LLM Configuration
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Application Security
    SECRET_KEY: str = "incidentmind-super-secure-production-key-2026"
    DEMO_MODE: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()
