from pydantic import BaseSettings

class Settings(BaseSettings):
    # Application settings
    app_name: str = "Decision Intelligence Platform"
    api_version: str = "v1"
    debug: bool = True

    # Database settings
    database_url: str
    redis_url: str

    # AI settings
    llama_model: str = "Llama 3.1 70B"
    knowledge_store_url: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()