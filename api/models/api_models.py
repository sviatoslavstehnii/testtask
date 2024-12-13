from pydantic import BaseModel


class PhoneNumber(BaseModel):
    phone_number: str

class TGSignIn(BaseModel):
    user_id: str
    phone_number: str
    code: str
    phone_code_hash: str