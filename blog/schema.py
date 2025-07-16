from typing import Optional
from datetime import datetime
from pydantic import BaseModel, constr
from auth.schema import DisplayUser

class BlogBase(BaseModel):
    title: str
    content: str

    class Config:
        from_attributes = True


class BlogUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]

    class Config:
        from_attributes = True


class BlogList(BaseModel):
    id: int
    title: str
    content: str
    createdDate: datetime
    owner: DisplayUser

    class Config:
        from_attributes = True
