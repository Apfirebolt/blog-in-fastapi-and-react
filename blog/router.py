from datetime import date
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


@router.get('/comments', status_code=status.HTTP_200_OK,
            response_model=List[schema.CommentListDisplay])
async def get_all_comments(database: Session = Depends(db.get_db), 
                           owner_id: int = None, 
                           blog_id: int = None,
                           date_posted: date = None):
    return await services.get_all_comments(database, owner_id, blog_id, date_posted)


@router.post('/sql/', status_code=status.HTTP_201_CREATED,
             response_model=schema.BlogSqlDisplay)
async def sql_create_blog(request: schema.BlogBase,
                          database: Session = Depends(db.get_db),
                          current_user: User = Depends(get_current_user)):
    user = database.query(User).filter(User.email == current_user.email).first()
    return await services.sql_create_blog(request, database, user)


@router.get('/sql/', status_code=status.HTTP_200_OK,
            response_model=List[schema.BlogSqlDisplay])
async def sql_blog_list(database: Session = Depends(db.get_db),
                        ):
    return await services.sql_get_blog_listing(database)


@router.get('/sql/{blog_id}/', status_code=status.HTTP_200_OK,
            response_model=schema.BlogSqlDisplay)
async def sql_get_blog_by_id(blog_id: int,
                             database: Session = Depends(db.get_db),
                            ):
    return await services.sql_get_blog_by_id(blog_id, database)


@router.put('/sql/{blog_id}/', status_code=status.HTTP_200_OK,
            response_model=schema.BlogSqlDisplay)
async def sql_update_blog_by_id(request: schema.BlogUpdate,
                                blog_id: int,
                                database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):
    return await services.sql_update_blog_by_id(request, blog_id, current_user.id, database)


@router.delete('/sql/{blog_id}/', status_code=status.HTTP_204_NO_CONTENT,
               response_class=Response)
async def sql_delete_blog_by_id(blog_id: int,
                                database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):
    await services.sql_delete_blog_by_id(blog_id, current_user.id, database)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/{blog_id}/', status_code=status.HTTP_200_OK, response_model=schema.BlogList)
async def get_blog_by_id(blog_id: int, database: Session = Depends(db.get_db),
                                current_user: User = Depends(get_current_user)):                            
    return await services.get_blog_by_id(blog_id, current_user.id, database)

