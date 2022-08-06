from typing import List
from fastapi import APIRouter, Depends, status, Response, Request
from sqlalchemy.orm import Session
from auth.jwt import get_current_user
from auth.models import User

import db

from .import schema
from .import services


router = APIRouter(
    tags=["Blog"],
    prefix='/blog'
)


@router.post('/', status_code=status.HTTP_201_CREATED,
             response_model=schema.BlogBase)
async def create_new_blog(request: schema.BlogBase, database: Session = Depends(db.get_db), 
    current_user: User = Depends(get_current_user)):
    user = database.query(User).filter(User.email == current_user.email).first()
    result = await services.create_new_blog(request, database, user)
    return result


@router.get('/', status_code=status.HTTP_200_OK,
            response_model=List[schema.BlogList])
async def blog_list(database: Session = Depends(db.get_db),
                      current_user: User = Depends(get_current_user)):
    result = await services.get_blog_listing(database)
    return result


@router.get('/{blog_id}', status_code=status.HTTP_200_OK, response_model=schema.BlogBase)
async def get_blog_by_id(blog_id: int, database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):                            
    return await services.get_blog_by_id(blog_id, current_user.id, database)


@router.delete('/{blog_id}', status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_blog_by_id(blog_id: int,
                                database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):
    return await services.delete_blog_by_id(blog_id, current_user.id, database)


@router.patch('/{blog_id}', status_code=status.HTTP_200_OK, response_model=schema.BlogBase)
async def update_blog_by_id(request: schema.BlogUpdate, blog_id: int, database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):                            
    return await services.update_blog_by_id(request, blog_id, current_user.id, database)
