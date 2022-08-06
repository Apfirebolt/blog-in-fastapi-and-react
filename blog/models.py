from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Float, String, ForeignKey, Text, DateTime, Integer


from db import Base


class Blog(Base):
    __tablename__ = "blog"

    id = Column(Integer, primary_key=True, autoincrement=True)
    createdDate = Column(DateTime, default=datetime.now)
    title = Column(String(50))
    content = Column(Text)
    owner_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    owner = relationship("User", back_populates="posts")


