from typing import Optional
from datetime import datetime
from pydantic import BaseModel, constr
from auth.schema import DisplayUser

class CommentBase(BaseModel):
    content: str

    class Config:
        from_attributes = True


class CommentUpdate(BaseModel):
    content: Optional[str]

    class Config:
        from_attributes = True


class CommentPost(BaseModel):
    content: str
    blog_id: int

    class Config:
        from_attributes = True


class CommentList(BaseModel):
    id: int
    content: str
    createdDate: datetime
    blog_id: int
    owner: DisplayUser

    class Config:
        from_attributes = True


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
    comments: Optional[list[CommentList]] = []

    class Config:
        from_attributes = True


