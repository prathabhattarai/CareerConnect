from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: Optional[int] = None
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str


class JobInfo(BaseModel):
    id: int
    title: str
    job_type: str
    location: Optional[str] = None
    work_mode: Optional[str] = None
    company_name: str = ""
    company_logo: Optional[str] = None

    class Config:
        from_attributes = True


class StudentInfo(BaseModel):
    id: int
    full_name: str
    email: str
    profile_photo: Optional[str] = None
    education: Optional[str] = None
    college_university: Optional[str] = None
    location: Optional[str] = None
    skills: list = []

    class Config:
        from_attributes = True


class InterviewInfo(BaseModel):
    id: int
    interview_date: Optional[datetime] = None
    interview_type: Optional[str] = None
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    resume_id: Optional[int] = None
    cover_letter: Optional[str] = None
    status: str
    applied_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    job: Optional[JobInfo] = None
    student: Optional[StudentInfo] = None
    interview: Optional[InterviewInfo] = None

    class Config:
        from_attributes = True


class ApplicationListResponse(BaseModel):
    applications: list
    total: int
