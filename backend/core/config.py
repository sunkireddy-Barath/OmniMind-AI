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
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://user:password@localhost/omnimind"
    )

    # Airia platform (primary LLM provider)
    AIRIA_API_KEY: str = os.getenv("AIRIA_API_KEY", "")
    AIRIA_API_URL: str = os.getenv("AIRIA_API_URL", "https://api.airia.ai/v1")
    AIRIA_AGENT_ID: str = os.getenv("AIRIA_AGENT_ID", "")

    # Backward-compatible aliases for older Gradient env vars
    GRADIENT_API_KEY: str = os.getenv("GRADIENT_API_KEY", "")
    GRADIENT_BASE_URL: str = os.getenv("GRADIENT_BASE_URL", "")
    GRADIENT_WORKSPACE_ID: str = os.getenv("GRADIENT_WORKSPACE_ID", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama3-1-70b-instruct")
    LLM_MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "2048"))
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.7"))

    # LLM Council — multi-provider keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gradient")

    # Multi-Agent Debate System
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_FINANCE_API_KEY: str = os.getenv("OPENAI_FINANCE_API_KEY", "")
    OPENAI_RESEARCH_API_KEY: str = os.getenv("OPENAI_RESEARCH_API_KEY", "")

    # Qdrant vector DB
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "omnimind_knowledge")

    # Sentence Transformers
    EMBEDDING_MODEL: str = os.getenv(
        "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
    )

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
        # Also look in parent directory if not found in backend/
        if not os.path.exists(".env") and os.path.exists("../.env"):
            env_file = "../.env"


settings = Settings()

# Normalize Airia config if only legacy Gradient env vars are present.
if not settings.AIRIA_API_KEY and settings.GRADIENT_API_KEY:
    settings.AIRIA_API_KEY = settings.GRADIENT_API_KEY
if not settings.AIRIA_API_URL and settings.GRADIENT_BASE_URL:
    settings.AIRIA_API_URL = settings.GRADIENT_BASE_URL
if not settings.AIRIA_AGENT_ID and settings.GRADIENT_WORKSPACE_ID:
    settings.AIRIA_AGENT_ID = settings.GRADIENT_WORKSPACE_ID
