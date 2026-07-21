from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompanyProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    about: Optional[str] = None
    founded_year: Optional[int] = None
    social_media_links: Optional[str] = None


class CompanyProfileResponse(BaseModel):
    id: int
    user_id: int
    logo: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    location: Optional[str] = None
    about: Optional[str] = None
    founded_year: Optional[int] = None
    social_media_links: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user_name: str = ""
    user_email: str = ""
    user_phone: str = ""

    class Config:
        from_attributes = True
