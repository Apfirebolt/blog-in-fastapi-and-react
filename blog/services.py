from fastapi import HTTPException, status
from typing import List
from . import models
from datetime import date, datetime
from sqlalchemy import func
from sqlalchemy import insert, update, delete, select


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
    blog = database.query(models.Blog).filter_by(id=blog_id).first()
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


async def create_new_comment(request, blog_id, current_user, database) -> models.Comments:
    # First check if the blog exists
    blog = database.query(models.Blog).filter_by(id=blog_id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Found !"
        )
    
    new_comment = models.Comments(
        content=request.content,
        blog_id=blog_id,
        owner_id=current_user.id,
        createdDate=datetime.now().strftime('%m/%d/%Y')
    )
    database.add(new_comment)
    database.commit()
    database.refresh(new_comment)
    return new_comment


async def get_comments_by_blog_id(blog_id, database) -> List[models.Comments]:
    comments = database.query(models.Comments).filter_by(blog_id=blog_id).all()
    if not comments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No comments found for this blog."
        )
    return comments


async def delete_comment_by_id(comment_id, user_id, database):
    comment = database.query(models.Comments).filter_by(id=comment_id, owner_id=user_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment Not Found or you do not have permission to delete it."
        )
    database.delete(comment)
    database.commit()


async def update_comment_by_id(request, comment_id, user_id, database):
    comment = database.query(models.Comments).filter_by(id=comment_id, owner_id=user_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment Not Found or you do not have permission to update it."
        )
    comment.content = request.content if request.content else comment.content
    database.commit()
    database.refresh(comment)
    return comment


async def get_all_comments(database, owner_id: int = None, blog_id: int = None, date_posted: date = None) -> List[models.Comments]:
    query = database.query(models.Comments)
    
    if owner_id is not None:
        query = query.filter(models.Comments.owner_id == owner_id)
    
    if blog_id is not None:
        query = query.filter(models.Comments.blog_id == blog_id)

    if date_posted is not None:
        query = query.filter(func.date(models.Comments.createdDate) == date_posted)
    
    comments = query.all()
    return comments


async def sql_create_blog(request, database, current_user) -> models.Blog:
    insert_stmt = insert(models.Blog).values(
        title=request.title,
        content=request.content,
        owner_id=current_user.id,
        createdDate=datetime.now()
    )
    insert_result = database.execute(insert_stmt)
    database.commit()

    inserted_primary_key = insert_result.inserted_primary_key
    blog_id = inserted_primary_key[0] if inserted_primary_key else None
    if blog_id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create blog."
        )

    select_stmt = select(models.Blog).where(models.Blog.id == blog_id)
    created_blog = database.execute(select_stmt).scalar_one_or_none()
    return created_blog


async def sql_get_blog_listing(database) -> List[models.Blog]:
    select_stmt = select(models.Blog.id, models.Blog.title, models.Blog.createdDate, models.Blog.owner_id).order_by(models.Blog.id.desc())
    results = database.execute(select_stmt).all()
    return results


async def sql_get_blog_by_id(blog_id: int, database) -> models.Blog:
    select_stmt = select(models.Blog).where(models.Blog.id == blog_id)
    blog = database.execute(select_stmt).scalar_one_or_none()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Found !"
        )
    return blog


async def sql_update_blog_by_id(request, blog_id: int, user_id: int, database) -> models.Blog:
    values_to_update = {}
    if request.title is not None:
        values_to_update["title"] = request.title
    if request.content is not None:
        values_to_update["content"] = request.content

    if values_to_update:
        update_stmt = (
            update(models.Blog)
            .where(models.Blog.id == blog_id, models.Blog.owner_id == user_id)
            .values(**values_to_update)
        )
        update_result = database.execute(update_stmt)
        if update_result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog Not Found !"
            )
        database.commit()

    select_stmt = select(models.Blog).where(models.Blog.id == blog_id, models.Blog.owner_id == user_id)
    updated_blog = database.execute(select_stmt).scalar_one_or_none()
    if not updated_blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Found !"
        )
    return updated_blog


async def sql_delete_blog_by_id(blog_id: int, user_id: int, database) -> None:
    delete_stmt = delete(models.Blog).where(models.Blog.id == blog_id, models.Blog.owner_id == user_id)
    delete_result = database.execute(delete_stmt)
    if delete_result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog Not Found !"
        )
    database.commit()






