from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InterviewCreate(BaseModel):
    application_id: int
    interview_date: datetime
    interview_type: str
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None


class InterviewUpdate(BaseModel):
    interview_date: Optional[datetime] = None
    interview_type: Optional[str] = None
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class ApplicationBrief(BaseModel):
    id: int
    job_title: str = ""
    student_name: str = ""

    class Config:
        from_attributes = True


class InterviewResponse(BaseModel):
    id: int
    application_id: int
    company_profile_id: int
    user_id: int
    interview_date: Optional[datetime] = None
    interview_type: str
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    application: Optional[ApplicationBrief] = None

    class Config:
        from_attributes = True


class InterviewListResponse(BaseModel):
    interviews: list
    total: int
