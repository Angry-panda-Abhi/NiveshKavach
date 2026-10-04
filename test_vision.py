import asyncio
import httpx
import os
import json
from dotenv import load_dotenv

load_dotenv('backend/.env')
api_key = os.getenv('OPENROUTER_API_KEY')

async def test():
    models = [
        'meta-llama/llama-3.2-11b-vision-instruct:free',
        'qwen/qwen-vl-plus:free',
        'google/gemini-pro-vision:free',
        'qwen/qwen-vl-plus'
    ]
    dummy_img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    
    async with httpx.AsyncClient() as client:
        for model in models:
            print(f'Testing {model}...')
            try:
                res = await client.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
                    json={
                        'model': model,
                        'messages': [{'role': 'user', 'content': [
                            {'type': 'text', 'text': 'Return {"status":"ok"}'},
                            {'type': 'image_url', 'image_url': {'url': dummy_img}}
                        ]}]
                    },
                    timeout=10.0
                )
                print(res.status_code, res.text[:200])
            except Exception as e:
                print('Error:', e)

if __name__ == "__main__":
    asyncio.run(test())
