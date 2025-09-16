"""Main FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ibc_ai.api.routes import api_router
from ibc_ai.api.middleware.exception_handler import setup_exception_handlers
from ibc_ai.config.database import init_database, close_database, wait_for_database
from ibc_ai.config.settings import settings
from ibc_ai.core.cache import init_cache, close_cache, warm_cache
from ibc_ai.core.logging import configure_logging, get_logger

# Configure application logging
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown."""
    # Startup
    logger.info("Starting IBC-AI application...")
    
    try:
        # Wait for database to be ready
        await wait_for_database()
        
        # Initialize cache
        await init_cache()
        
        # Warm up cache with frequently accessed data
        await warm_cache()
        
        logger.info("Application startup completed successfully")
        
    except Exception as e:
        logger.error(f"Application startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down IBC-AI application...")
    
    try:
        # Close database connections
        await close_database()
        
        # Close cache connections
        await close_cache()
        
        logger.info("Application shutdown completed successfully")
        
    except Exception as e:
        logger.error(f"Application shutdown error: {e}")


# Create FastAPI application
app = FastAPI(
    title="IBC-AI Protocol Review System",
    description="AI-powered system for biosafety committee protocol review",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
if settings.allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in settings.allowed_origins.split(",")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Set up exception handlers
setup_exception_handlers(app)

# Include API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Health"])
async def health_check() -> dict:
    """Basic health check endpoint."""
    return {"status": "ok", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)