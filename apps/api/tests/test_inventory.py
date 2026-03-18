import pytest
from httpx import AsyncClient
from uuid import uuid4

@pytest.mark.asyncio
async def test_get_inventory_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/inventory/assets/mine")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_public_asset_not_found(client: AsyncClient):
    random_id = uuid4()
    response = await client.get(f"/api/v1/inventory/assets/{random_id}")
    assert response.status_code == 404
