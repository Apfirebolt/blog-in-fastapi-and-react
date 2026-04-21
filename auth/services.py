from fastapi import HTTPException, status
from typing import List, Optional

from . import schema
from . import models


async def new_user_register(request: schema.User, database: 'Session') -> models.User:
    new_user = models.User(username=request.username, email=request.email,
                           password=request.password,
                           firstName=request.firstName,
                           lastName=request.lastName)

    database.add(new_user)
    database.commit()
    database.refresh(new_user)
    return new_user


async def all_users(database: 'Session') -> List[models.User]:
    users = database.query(models.User).all()
    return users


async def get_user_by_id(user_id: int, database: 'Session') -> Optional[models.User]:
    user_info = database.query(models.User).get(user_id)

    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data not found!"
        )

    return user_info


async def get_profile(database: 'Session', current_user: schema.TokenData) -> models.User:
    user = database.query(models.User).filter(models.User.email == current_user.email).first()
    return user

