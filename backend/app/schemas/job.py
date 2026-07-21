from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    description: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    job_type: str
    work_mode: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    experience_level: Optional[str] = None
    application_deadline: Optional[datetime] = None
    number_of_openings: int = 1
    skills: Optional[List[str]] = []
    status: str = "draft"


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    job_type: Optional[str] = None
    work_mode: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    experience_level: Optional[str] = None
    application_deadline: Optional[datetime] = None
    number_of_openings: Optional[int] = None
    status: Optional[str] = None
    skills: Optional[List[str]] = None


class SkillOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class CompanyInfo(BaseModel):
    id: int
    company_name: str
    logo: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    company_size: Optional[str] = None

    class Config:
        from_attributes = True


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    job_type: str
    work_mode: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    experience_level: Optional[str] = None
    application_deadline: Optional[datetime] = None
    number_of_openings: int = 1
    status: str
    total_views: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    skills: List[SkillOut] = []
    company: Optional[CompanyInfo] = None
    application_count: int = 0
    is_saved: bool = False

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
