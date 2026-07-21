from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_profile_id = Column(Integer, ForeignKey("company_profiles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    responsibilities = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    job_type = Column(Enum("internship", "full_time", "part_time", "contract", name="job_type_enum"), nullable=False)
    work_mode = Column(Enum("remote", "onsite", "hybrid", name="work_mode_enum"), nullable=True)
    location = Column(String(255), nullable=True)
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    experience_level = Column(Enum("entry", "mid", "senior", "lead", name="experience_level_enum"), nullable=True)
    application_deadline = Column(DateTime, nullable=True)
    number_of_openings = Column(Integer, default=1)
    status = Column(Enum("draft", "active", "closed", name="job_status_enum"), default="draft")
    total_views = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    company = relationship("CompanyProfile", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job")
    applications = relationship("Application", back_populates="job")
    saved_jobs = relationship("SavedJob", back_populates="job")
