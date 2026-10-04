from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.models.database import init_db
from app.routers import analyze, verify, educate, voice, grievance, whatsapp, tools
from app.models.schemas import HealthResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting NiveshKavach Application...")
    try:
        init_db()
        logger.info("Database initialized.")
        # Seeding scam patterns from JSON can be done here by another service
    except Exception as e:
        logger.error(f"Error during startup: {e}")
    yield
    # Shutdown
    logger.info("Shutting down NiveshKavach Application...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for NiveshKavach - Investor Protection Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/v1")
app.include_router(verify.router, prefix="/api/v1")
app.include_router(educate.router, prefix="/api/v1")
app.include_router(voice.router, prefix="/api/v1")
app.include_router(grievance.router, prefix="/api/v1")
app.include_router(whatsapp.router, prefix="/api/v1")
app.include_router(tools.router, prefix="/api/v1")

@app.get("/", tags=["Root"])
def read_root():
    return {
        "project": settings.APP_NAME,
        "status": "online",
        "message": "Welcome to the NiveshKavach API"
    }

@app.get("/health", response_model=HealthResponse, tags=["System"])
def health_check():
    return HealthResponse(status="healthy", version="1.0.0")
