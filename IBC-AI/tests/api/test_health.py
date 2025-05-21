"""Tests for health check endpoint."""

import pytest
from httpx import AsyncClient

from ibc_ai.version import get_version


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient) -> None:
    """Test health check endpoint."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == get_version()
    assert "database" in data["services"]
    assert data["services"]["database"]["status"] == "operational"