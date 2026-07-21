from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    college_university: Optional[str] = None
    graduation_year: Optional[int] = None
    location: Optional[str] = None
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    portfolio_link: Optional[str] = None
    certifications: Optional[str] = None
    projects: Optional[str] = None
    work_experience: Optional[str] = None


class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    profile_photo: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    college_university: Optional[str] = None
    graduation_year: Optional[int] = None
    location: Optional[str] = None
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    portfolio_link: Optional[str] = None
    certifications: Optional[str] = None
    projects: Optional[str] = None
    work_experience: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    completion_percentage: float = 0
    skills: List[str] = []
    user_name: str = ""
    user_email: str = ""
    user_phone: str = ""

    class Config:
        from_attributes = True


class SkillResponse(BaseModel):
    id: int
    name: str
    category: Optional[str] = None

    class Config:
        from_attributes = True


class AddSkills(BaseModel):
    skills: List[str]
