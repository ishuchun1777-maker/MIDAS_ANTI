import httpx
import asyncio

async def test_api():
    base_url = "http://localhost:8001/api/v1"
    
    print("\n1. Testing Discovery API (GET /discovery/assets)...")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{base_url}/discovery/assets")
            if resp.status_code != 200:
                print(f"Error Detail: {resp.text}")
            data = resp.json()
            print(f"Total found: {data.get('total_count')}")
            for asset in data.get('results', []):
                print(f"- {asset['title']} ({asset['media_type']}) by {asset['seller_name']}")
    except Exception as e:
        print(f"API Error: {e}")

    print("\n2. Testing Shortlist API (REQUIRES AUTH - skipping in automated script)...")
    print("Manual check recommended for shortlisted items.")

if __name__ == "__main__":
    asyncio.run(test_api())
