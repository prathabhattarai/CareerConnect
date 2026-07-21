from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_profile_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="student_skills")
    student_profile = relationship("StudentProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="student_skills")
