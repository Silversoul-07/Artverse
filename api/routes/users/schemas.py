from api.common import *

class token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: str

    class Config:
        form_attributes = True

class Session(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    
class UserCreate(BaseModel):
    email: str
    password: str

class UserValidate(BaseModel):
    email: str
    password: str