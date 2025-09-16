"""
Pytest configuration and shared fixtures for the IBC-AI test suite.
Enhanced with comprehensive test utilities and mock services.
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from unittest.mock import Mock, AsyncMock
from httpx import AsyncClient
from fastapi import FastAPI
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from ibc_ai.data.database.base import Base
from ibc_ai.data.database.session import get_db
from ibc_ai.main import app
from ibc_ai.infrastructure.security import JWTService, AuthenticationService
from tests.factories import UserFactory, ProtocolFactory, BiologicalAgentFactory

# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@postgres/test_ibc_ai"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def test_engine() -> AsyncGenerator[AsyncEngine, None]:
    """Create a test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        poolclass=NullPool,
    )
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def test_db(test_engine: AsyncEngine) -> AsyncGenerator[None, None]:
    """Create test database tables for each test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def test_session(
    test_engine: AsyncEngine, test_db: None
) -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    session_factory = sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False,
    )
    async with session_factory() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def client(test_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create a test client with test database session."""

    async def _get_test_db():
        yield test_session

    # Override the get_db dependency
    app.dependency_overrides[get_db] = _get_test_db

    # Create test client
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

    # Clear dependency override
    app.dependency_overrides = {}


# Enhanced test fixtures for new testing framework

@pytest.fixture
def mock_jwt_service():
    """Create a mock JWT service for testing."""
    service = Mock(spec=JWTService)
    service.create_token_pair.return_value = Mock(
        access_token="mock-access-token",
        refresh_token="mock-refresh-token",
        expires_in=3600,
        token_type="Bearer"
    )
    service.validate_token.return_value = Mock(
        user_id="test-user-id",
        email="test@example.com",
        roles=["researcher"]
    )
    service.extract_user_context.return_value = {
        "user_id": "test-user-id",
        "email": "test@example.com", 
        "roles": ["researcher"],
        "is_admin": False,
        "can_review": False,
        "can_submit": True
    }
    return service


@pytest.fixture
def mock_auth_service():
    """Create a mock authentication service for testing."""
    service = AsyncMock(spec=AuthenticationService)
    
    # Configure default return values
    service.authenticate_user.return_value = Mock(
        success=True,
        user=UserFactory(),
        tokens=Mock(
            access_token="mock-access-token",
            refresh_token="mock-refresh-token"
        ),
        errors=[]
    )
    
    service.register_user.return_value = Mock(
        success=True,
        user=UserFactory(),
        errors=[]
    )
    
    return service


@pytest.fixture
def sample_user():
    """Create a sample user for testing."""
    return UserFactory()


@pytest.fixture
def admin_user():
    """Create an admin user for testing.""" 
    return UserFactory.create_admin()


@pytest.fixture
def reviewer_user():
    """Create a reviewer user for testing."""
    return UserFactory.create_reviewer()


@pytest.fixture
def sample_protocol():
    """Create a sample protocol for testing."""
    return ProtocolFactory()


@pytest.fixture
def bsl2_protocol():
    """Create a BSL-2 protocol for testing."""
    from ibc_ai.domain.entities.protocol import ContainmentLevel
    return ProtocolFactory.create_with_containment_level(ContainmentLevel.BSL2)


@pytest.fixture
def sample_biological_agent():
    """Create a sample biological agent for testing."""
    return BiologicalAgentFactory()


@pytest.fixture
def bsl3_agent():
    """Create a BSL-3 biological agent for testing."""
    return BiologicalAgentFactory.create_bsl3()


@pytest.fixture
def select_agent():
    """Create a select agent for testing."""
    return BiologicalAgentFactory.create_cdc_select_agent()


@pytest.fixture
def test_app() -> FastAPI:
    """Create FastAPI application for testing."""
    from fastapi import FastAPI
    
    test_app = FastAPI(title="IBC-AI Test API", version="1.0.0")
    
    # Add routers
    from ibc_ai.api.routers.auth import router as auth_router
    test_app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
    
    return test_app


@pytest.fixture
def authenticated_client(client: AsyncClient, admin_user) -> AsyncClient:
    """Create authenticated HTTP client for testing."""
    # Add authentication headers
    client.headers.update({
        "Authorization": "Bearer mock-access-token"
    })
    return client


@pytest.fixture(autouse=True)
def reset_factories():
    """Reset factory sequences between tests."""
    # Reset any global state in factories if needed
    yield
    # Cleanup after test


@pytest.fixture
def temp_pdf_file():
    """Create a temporary PDF file for testing."""
    import tempfile
    import os
    
    # Create temporary file
    fd, path = tempfile.mkstemp(suffix='.pdf')
    
    try:
        # Write some PDF-like content
        with os.fdopen(fd, 'wb') as f:
            # This is not a real PDF, just for testing
            f.write(b'%PDF-1.4\n%mock pdf content for testing\n')
        
        yield path
    finally:
        # Clean up
        if os.path.exists(path):
            os.unlink(path)


@pytest.fixture
def mock_database():
    """Create a mock database connection for testing."""
    db = Mock()
    
    # Configure common database operations
    db.execute.return_value = Mock(rowcount=1)
    db.fetchone.return_value = None
    db.fetchall.return_value = []
    db.commit.return_value = None
    db.rollback.return_value = None
    
    return db


@pytest.fixture
def mock_redis():
    """Create a mock Redis connection for testing."""
    redis = Mock()
    
    # Configure common Redis operations
    redis.get.return_value = None
    redis.set.return_value = True
    redis.delete.return_value = True
    redis.exists.return_value = False
    
    return redis


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Set up test environment variables and configuration."""
    import os
    
    # Set test environment variables
    original_env = os.environ.copy()
    
    os.environ.update({
        "TESTING": "true",
        "DATABASE_URL": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key-for-testing-only",
        "REDIS_URL": "redis://localhost:6379/1"
    })
    
    yield
    
    # Restore original environment
    os.environ.clear()
    os.environ.update(original_env)


# Performance test helpers
@pytest.fixture
def performance_timer():
    """Timer fixture for performance tests."""
    import time
    
    class Timer:
        def __init__(self):
            self.start_time = None
            self.end_time = None
        
        def start(self):
            self.start_time = time.time()
        
        def stop(self):
            self.end_time = time.time()
        
        @property
        def elapsed(self):
            if self.start_time and self.end_time:
                return self.end_time - self.start_time
            return None
    
    return Timer()


# Test data collections
@pytest.fixture
def protocol_test_data():
    """Collection of test protocols for batch testing."""
    return [
        ProtocolFactory() for _ in range(10)
    ]


@pytest.fixture
def agent_test_data():
    """Collection of test biological agents for batch testing."""
    return BiologicalAgentFactory.create_regulatory_test_set()


@pytest.fixture
def user_test_data():
    """Collection of test users with different roles."""
    return [
        UserFactory.create_admin(),
        UserFactory.create_reviewer(), 
        UserFactory.create_researcher(),
        UserFactory.create_committee_member(),
        UserFactory.create_readonly()
    ]


# Validation test helpers
@pytest.fixture
def validation_test_cases():
    """Common validation test cases."""
    return {
        "valid_emails": [
            "test@example.com",
            "user.name@domain.co.uk",
            "admin@university.edu"
        ],
        "invalid_emails": [
            "not-an-email",
            "@domain.com",
            "user@",
            "user name@domain.com"
        ],
        "valid_passwords": [
            "SecurePassword123!",
            "C0mpl3x$P@ssw0rd",
            "ValidPass1!"
        ],
        "invalid_passwords": [
            "password",
            "12345678",
            "NoNumbers!",
            "nonumbers123",
            "NOLOWERCASE123!",
            "short"
        ]
    }


# Pytest markers for test categorization
pytestmark = [
    pytest.mark.asyncio
]