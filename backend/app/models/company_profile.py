from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    logo = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    industry = Column(String(255), nullable=True)
    company_size = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    about = Column(Text, nullable=True)
    founded_year = Column(Integer, nullable=True)
    social_media_links = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="company_profile")
    jobs = relationship("Job", back_populates="company")
