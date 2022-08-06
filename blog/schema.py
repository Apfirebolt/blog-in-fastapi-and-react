from typing import Optional
from pydantic import BaseModel, constr


class BlogBase(BaseModel):
    id: Optional[int]
    title: str
    content: str

    class Config:
        orm_mode = True

class BlogUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]

    class Config:
        orm_mode = True


class BlogList(BaseModel):
    id: int
    title: str
    content: str
    owner_id: int
    createdAt: Optional[str]

    class Config:
        orm_mode = True
