from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, String, ForeignKey, Text, DateTime, Integer


from db import Base


class Blog(Base):
    __tablename__ = "blog"

    id = Column(Integer, primary_key=True, autoincrement=True)
    createdDate = Column(DateTime, default=datetime.now)
    title = Column(String(50))
    content = Column(Text)
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    owner = relationship("User", back_populates="posts")
    comments = relationship("Comments", back_populates="blog", cascade="all, delete-orphan")


class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    createdDate = Column(DateTime, default=datetime.now)
    content = Column(Text)
    blog_id = Column(Integer, ForeignKey("blog.id", ondelete="CASCADE"))
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    blog = relationship("Blog", back_populates="comments")
    owner = relationship("User", back_populates="comments")

