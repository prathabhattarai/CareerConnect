from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_profile_id = Column(Integer, ForeignKey("company_profiles.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    interview_date = Column(DateTime, nullable=False)
    interview_type = Column(Enum("video", "phone", "onsite", name="interview_type_enum"), nullable=False)
    meeting_link = Column(String(500), nullable=True)
    location = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(Enum("scheduled", "completed", "cancelled", name="interview_status_enum"), default="scheduled")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    application = relationship("Application", back_populates="interview")
