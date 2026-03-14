from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import SessionLocal
from app.models import Base
from app.repositories import index as repositories
from app.cache import redis as cache

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
@app.on_event("startup")
async def startup():
    async with SessionLocal() as session:
        await repositories.initialize_db(session)

@app.on_event("shutdown")
async def shutdown():
    await cache.close_connection()

# Include your API routes here
# from app.api import routes
# app.include_router(routes.router)