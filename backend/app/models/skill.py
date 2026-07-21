from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    student_skills = relationship("StudentSkill", back_populates="skill")
    job_skills = relationship("JobSkill", back_populates="skill")
