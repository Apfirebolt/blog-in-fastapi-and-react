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
    comments = database.query(models.Comment).filter_by(blog_id=blog_id).all()
    if not comments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No comments found for this blog."
        )
    return comments


async def delete_comment_by_id(comment_id, user_id, database):
    comment = database.query(models.Comment).filter_by(id=comment_id, author_id=user_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment Not Found or you do not have permission to delete it."
        )
    database.delete(comment)
    database.commit()
    return {"detail": "Comment deleted successfully."}


async def update_comment_by_id(request, comment_id, user_id, database):
    comment = database.query(models.Comment).filter_by(id=comment_id, author_id=user_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment Not Found or you do not have permission to update it."
        )
    comment.content = request.content if request.content else comment.content
    database.commit()
    database.refresh(comment)
    return comment






