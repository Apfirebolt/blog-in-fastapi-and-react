import email
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class User(BaseModel):
    username: str
    email: EmailStr
    firstName: str
    lastName: str
    password: str


class DisplayUser(BaseModel):
    id: int
    username: str

class UserLogin(BaseModel):
    id: int
    email: EmailStr
    username: str
    token: Optional[str] = None


class DisplayAccount(BaseModel):
    id: int
    username: str
    email: str
    firstName: Optional[str]
    lastName: Optional[str]

    class Config:
        from_attributes = True


class Login(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[int]