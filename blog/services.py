from fastapi import HTTPException, status
from typing import List
from . import models
from datetime import datetime


async def create_new_blog(request, database, current_user) -> models.Blog:
    new_blog = models.Blog(title=request.title, content=request.content,
                                    owner_id=current_user.id, createdDate=datetime.now().strftime('%m/%d/%Y'))
    database.add(new_blog)
    database.commit()
    database.refresh(new_blog)
    return new_blog


async def get_blog_listing(database) -> List[models.Blog]:
    blogs = database.query(models.Blog).all()
    return blogs


async def get_blog_by_id(blog_id, user_id, database):
    blog = database.query(models.Blog).filter_by(id=blog_id, owner_id=user_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Found !"
        )
    return blog


async def delete_blog_by_id(blog_id, user_id, database):
    database.query(models.Blog).filter(
        models.Blog.id == blog_id and models.Blog.owner_id == user_id).delete()
    database.commit()


async def update_blog_by_id(request, blog_id, user_id, database):
    blog = database.query(models.Blog).filter_by(id=blog_id, owner_id=user_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Found !"
        )
    blog.title = request.title if request.title else blog.title
    blog.content = request.content if request.content else blog.content
    database.commit()
    database.refresh(blog)
    return blog






