from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    
    # Twilio Configuration
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_NUMBER: str = ""
    
    # Database and Redis
    DATABASE_URL: str = "sqlite:///./niveshkavach.db"
    REDIS_URL: Optional[str] = None
    
    # Environment
    ENVIRONMENT: str = "dev"
    PORT: int = 8000
    APP_NAME: str = "NiveshKavach"
    SUPPORTED_LANGUAGES: List[str] = ["hi", "en", "mr", "bn", "ta", "te"]

    class Config:
        env_file = ".env"

settings = Settings()
