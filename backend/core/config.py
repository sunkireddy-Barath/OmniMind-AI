from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "OmniMind AI"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://omnimind-ai.vercel.app"
    ]
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/omnimind")
    
    # AI/LLM Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "meta-llama/Meta-Llama-3.1-70B-Instruct")
    GRADIENT_BASE_URL: str = os.getenv("GRADIENT_BASE_URL", "https://inference.do-ai.run/v1")
    GRADIENT_API_KEY: str = os.getenv("GRADIENT_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gradient")
    
    # Vector Database
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    SESSION_CACHE_TTL_SECONDS: int = int(os.getenv("SESSION_CACHE_TTL_SECONDS", "3600"))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Agent Settings
    MAX_AGENTS: int = 10
    AGENT_TIMEOUT: int = 300  # seconds
    
    class Config:
        env_file = ".env"

settings = Settings()