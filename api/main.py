from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import dotenv_values
from api import API

config = dotenv_values(".env")

api_id = config["API_ID"]
api_hash = config["API_HASH"]
db_password = config["DB_PASSWORD"]


uri = f"mongodb+srv://sviatkostehnii:{db_password}@cluster0.iswe6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
port = 8000
client = MongoClient(uri, port)
db = client["User"]

api = API(api_id, api_hash, db)
app = api.app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000)

