import asyncio

from fastapi import APIRouter, FastAPI
from api_service import APIService


from dotenv import dotenv_values
config = dotenv_values(".env") 

api_id = config["API_ID"]
api_hash = config["API_HASH"]



api_service = APIService(api_id, api_hash)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(api_service.app, host="127.0.0.1", port=8000, reload=True)

