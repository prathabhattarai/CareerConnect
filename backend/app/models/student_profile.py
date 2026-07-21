from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    profile_photo = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    education = Column(String(255), nullable=True)
    college_university = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    location = Column(String(255), nullable=True)
    github_link = Column(String(500), nullable=True)
    linkedin_link = Column(String(500), nullable=True)
    portfolio_link = Column(String(500), nullable=True)
    certifications = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    work_experience = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="student_profile")
    skills = relationship("StudentSkill", back_populates="student_profile")
