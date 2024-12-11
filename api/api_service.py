import uuid
from fastapi import FastAPI, HTTPException
from telegram_service import TelegramService


class APIService:

    def __init__(self, api_id, api_hash):
        self.app = FastAPI()
        self.setup_routes()
        self.api_id = api_id
        self.api_hash = api_hash
        self.tg_service = TelegramService(api_id, api_hash)

    
    def setup_routes(self):
        
        @self.app.post("/send_code")
        async def send_code(phone_number: str):
            user_id = str(uuid.uuid4()) 

            phone_code_hash = await self.tg_service.send_code(user_id, phone_number)
            if phone_code_hash:
                return {"user_id": user_id, "phone_code_hash": phone_code_hash,
                         "message": f"Code sent to {phone_number}"}
            else:
                return {"user_id": user_id, "message": "User is already authorized"}

        @self.app.post("/sign_in")
        async def sign_in(user_id: str, phone_number: str, code: str, phone_code_hash: str):
            try:
                await self.tg_service.sign_in(user_id, phone_number, code, phone_code_hash)
                return {"message": f"Successfully signed in as {phone_number}"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
        @self.app.get("/print_data")
        async def sign_in(user_id: str):
            await self.tg_service.print_chats(user_id)
        