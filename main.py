from fastapi import FastAPI
from api_service import APIService
from dotenv import dotenv_values

config = dotenv_values(".env")

api_id = config["API_ID"]
api_hash = config["API_HASH"]


api_service = APIService(api_id, api_hash)

app = api_service.app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

