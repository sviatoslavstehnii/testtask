import datetime
import os
import redis
from teleredis import RedisSession
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError


class TelegramService:

    def __init__(self, api_id, api_hash):
        self.api_id = api_id
        self.api_hash = api_hash
        self.redis_connector = redis.Redis(host='localhost', port=6380, db=0, decode_responses=False)


    def get_client(self, identifier):
        session = RedisSession(identifier, self.redis_connector)  
        return TelegramClient(session, self.api_id, self.api_hash)

    async def send_code(self, user_id, phone_number) -> None|str:
        client = self.get_client(user_id)
        await client.connect()
        if not await client.is_user_authorized():
            result = await client.send_code_request(phone_number)
            return result.phone_code_hash
        return None
    
    async def sign_in(self, identifier, phone_number, code, phone_code_hash):
        client = self.get_client(identifier)
        await client.connect()
        if not await client.is_user_authorized():
            await client.sign_in(phone=phone_number, code=code, phone_code_hash=phone_code_hash)   

    async def get_dialogs(self, identifier) -> list[dict]:
        client = self.get_client(identifier)
        await client.connect()
        if await client.is_user_authorized():
            non_archived = await client.get_dialogs(archived=False)
            dialogs_json = [
                {
                    "id": dialog.id,
                    "name": dialog.name,
                    "unread_count": dialog.unread_count,
                    "is_group": dialog.is_group,
                    "is_channel": dialog.is_channel,
                    "is_user": dialog.is_user,
                }
                for dialog in non_archived
            ]
            return dialogs_json
        return []
    
    async def get_messages(self, identifier, dialog_name, offset) -> list[dict]:
        client = self.get_client(identifier)
        messages = []
        await client.connect()
        if await client.is_user_authorized():
            await client.get_dialogs(archived=False)
            async for msg in client.iter_messages(dialog_name, limit=10, add_offset=offset):
                message_json = {
                    "message_id": msg.id,
                    "sender_id": msg.sender_id,
                    "text": msg.text if msg.text else "",
                    }
                messages.append(message_json)
            return messages
        return []
    



    