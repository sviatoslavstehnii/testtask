from typing import Annotated
import uuid
from models.api_models import PhoneNumber, TGSignIn
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from models.auth_models import User
from services.auth_service import *
from services.telegram_service import TelegramService


class API:

    def __init__(self, api_id, api_hash, db):
        self.app = FastAPI()
        self.setup_routes()
        self.db = db
        self.api_id = api_id
        self.api_hash = api_hash
        self.tg_service = TelegramService(api_id, api_hash)

    
    def setup_routes(self):
        
        @self.app.post("/send_code")
        async def send_code(body: PhoneNumber, current_user: dict = Depends(get_current_user)):
            phone_number = body.phone_number
            user_id = str(uuid.uuid4()) 

            phone_code_hash = await self.tg_service.send_code(user_id, phone_number)
            if phone_code_hash:
                return {"user_id": user_id, "phone_code_hash": phone_code_hash,
                         "message": f"Code sent to {phone_number}"}
            else:
                return {"user_id": user_id, "message": "User is already authorized"}

        @self.app.post("/sign_in")
        async def sign_in(body: TGSignIn, current_user: dict = Depends(get_current_user)):
            try:
                await self.tg_service.sign_in(body.user_id, body.phone_number, body.code, body.phone_code_hash)
                return {"message": f"Successfully signed in as {body.phone_number}"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
            
        @self.app.get("/dialogs/{user_id}")
        async def get_dialogs(user_id: str, current_user: dict = Depends(get_current_user)):
            dialogs = await self.tg_service.get_dialogs(user_id)
            return JSONResponse(content=dialogs)
        
        @self.app.get("/messages/{user_id}")
        async def get_messages(user_id: str, dialog_name: int, offset:int = 0, current_user: dict = Depends(get_current_user)):
            messages = await self.tg_service.get_messages(user_id, dialog_name, offset)
            return JSONResponse(content=messages)
        
        @self.app.post('/register')
        def create_user(request:User):
            hashed_pass = Hash.bcrypt(request.password)
            user_object = dict(request)
            user_object["password"] = hashed_pass
            user_id = self.db["users"].insert(user_object)
            return {"res":"created"}

        @self.app.post('/login')
        def login(request:User):
            user = self.db["users"].find_one({"username":request.username})
            if not user:
                raise HTTPException(status_code=404, detail = f'No user found with this {request.username} username')
            if not Hash.verify(user["password"],request.password):
                raise HTTPException(status_code=404, detail = f'Wrong Username or password')
            access_token = create_access_token(data={"sub": user["username"] })
            return {"access_token": access_token, "token_type": "bearer"}
                