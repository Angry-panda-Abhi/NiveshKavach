import asyncio, httpx, os
from dotenv import load_dotenv

load_dotenv('backend/.env')
api_key = os.getenv('OPENROUTER_API_KEY')

async def test():
    dummy_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    async with httpx.AsyncClient() as client:
        res = await client.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
            json={
                'model': 'qwen/qwen3.8-27b:free',
                'messages': [{'role': 'user', 'content': [
                    {'type': 'text', 'text': 'Return JSON'},
                    {'type': 'image_url', 'image_url': {'url': dummy_img}}
                ]}]
            },
            timeout=15.0
        )
        print(res.status_code, res.text[:200])
if __name__ == '__main__':
    asyncio.run(test())
