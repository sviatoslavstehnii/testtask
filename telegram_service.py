import os
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError


class TelegramService:

    def __init__(self, api_id, api_hash, session_dir="sessions"):
        self.api_id = api_id
        self.api_hash = api_hash
        self.session_dir = session_dir

        if not os.path.exists(session_dir):
            os.makedirs(session_dir)

    def get_client(self, identifier):
        session_path = os.path.join("sessions/", f"{identifier}.session")
        return TelegramClient(session_path, self.api_id, self.api_hash)

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

    async def print_chats(self, identifier) -> None:
        client = self.get_client(identifier)
        await client.connect()
        print("hello")
        if await client.is_user_authorized():
            non_archived = await client.get_dialogs(archived=False)
            for dialog in non_archived:
                async for message in client.iter_messages(dialog):
                    print(f"[{message.date}] {message.sender_id}: {message.text}")
                break

    