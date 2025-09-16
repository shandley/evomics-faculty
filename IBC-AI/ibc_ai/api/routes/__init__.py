"""API routes module."""

from fastapi import APIRouter

from .documents import router as documents_router
from .health import router as health_router
# from .monitoring import router as monitoring_router  # Temporarily disabled - redis dependency
from .protocols import router as protocols_router
# from ..routers.auth import router as auth_router  # Temporarily disabled - dependency injection issues

# Create main API router
api_router = APIRouter()

# Include all route modules
# api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])  # Temporarily disabled
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(documents_router, tags=["Documents"])
api_router.include_router(protocols_router, tags=["Protocols"])
# api_router.include_router(monitoring_router, tags=["Monitoring"])  # Temporarily disabled

# Import and include other router modules here as they are created
# api_router.include_router(knowledge_router, prefix="/knowledge", tags=["Knowledge Base"])
# api_router.include_router(risk_router, prefix="/risk", tags=["Risk Assessment"])