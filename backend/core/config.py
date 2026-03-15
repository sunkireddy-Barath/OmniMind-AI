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
        "https://omnimind-ai.vercel.app",
    ]

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/omnimind")

    # DigitalOcean Gradient AI — primary LLM provider
    GRADIENT_API_KEY: str = os.getenv("GRADIENT_API_KEY", "")
    GRADIENT_BASE_URL: str = os.getenv("GRADIENT_BASE_URL", "https://inference.do-ai.run/v1")
    GRADIENT_WORKSPACE_ID: str = os.getenv("GRADIENT_WORKSPACE_ID", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama3-1-70b-instruct")
    LLM_MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "2048"))
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.7"))

    # OpenAI fallback
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gradient")

    # Qdrant vector DB
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "omnimind_knowledge")

    # Sentence Transformers
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    SESSION_CACHE_TTL_SECONDS: int = int(os.getenv("SESSION_CACHE_TTL_SECONDS", "3600"))

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Agent Settings
    MAX_AGENTS: int = 10
    AGENT_TIMEOUT: int = 300

    class Config:
        env_file = ".env"


settings = Settings()
