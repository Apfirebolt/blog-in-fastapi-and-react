import email
from typing import Optional, List
from pydantic import BaseModel, constr, EmailStr
from blog.schema import BlogList


class User(BaseModel):
    username: constr(min_length=2, max_length=50)
    email: EmailStr
    firstName: str
    lastName: str
    password: str


class DisplayAccount(BaseModel):
    id: int
    username: str
    email: str
    firstName: Optional[str]
    lastName: Optional[str]
    posts: List[BlogList] = []

    class Config:
        orm_mode = True


class Login(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[int]