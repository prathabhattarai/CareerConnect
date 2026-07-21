import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_company
from app.core.config import get_settings
from app.models.user import User
from app.models.company_profile import CompanyProfile
from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview
from app.schemas.company import CompanyProfileUpdate, CompanyProfileResponse

router = APIRouter()
settings = get_settings()


@router.get("/profile", response_model=CompanyProfileResponse)
def get_company_profile(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        profile = CompanyProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return CompanyProfileResponse(
        id=profile.id, user_id=profile.user_id, logo=profile.logo,
        website=profile.website, industry=profile.industry,
        company_size=profile.company_size, location=profile.location,
        about=profile.about, founded_year=profile.founded_year,
        social_media_links=profile.social_media_links,
        created_at=profile.created_at, updated_at=profile.updated_at,
        user_name=current_user.full_name, user_email=current_user.email,
        user_phone=current_user.phone or "",
    )


@router.put("/profile", response_model=CompanyProfileResponse)
def update_company_profile(
    data: CompanyProfileUpdate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        profile = CompanyProfile(user_id=current_user.id)
        db.add(profile)

    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.phone is not None:
        current_user.phone = data.phone

    profile_fields = ['website', 'industry', 'company_size', 'location', 'about', 'founded_year', 'social_media_links']
    for field in profile_fields:
        val = getattr(data, field, None)
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    db.refresh(current_user)

    return CompanyProfileResponse(
        id=profile.id, user_id=profile.user_id, logo=profile.logo,
        website=profile.website, industry=profile.industry,
        company_size=profile.company_size, location=profile.location,
        about=profile.about, founded_year=profile.founded_year,
        social_media_links=profile.social_media_links,
        created_at=profile.created_at, updated_at=profile.updated_at,
        user_name=current_user.full_name, user_email=current_user.email,
        user_phone=current_user.phone or "",
    )


@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_LOGO_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed")

    content = await file.read()
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, "logos", filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(content)

    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if profile:
        profile.logo = file_path
        db.commit()

    return {"message": "Logo uploaded", "logo": file_path}


@router.get("/dashboard")
def get_company_dashboard(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    total_jobs = db.query(func.count(Job.id)).filter(Job.user_id == current_user.id).scalar()
    active_jobs = db.query(func.count(Job.id)).filter(
        Job.user_id == current_user.id, Job.status == "active"
    ).scalar()
    total_apps = db.query(func.count(Application.id)).join(Job).filter(Job.user_id == current_user.id).scalar()
    shortlisted = db.query(func.count(Application.id)).join(Job).filter(
        Job.user_id == current_user.id, Application.status == "shortlisted"
    ).scalar()
    interviews = db.query(func.count(Interview.id)).join(Application).join(Job).filter(
        Job.user_id == current_user.id
    ).scalar()
    selected = db.query(func.count(Application.id)).join(Job).filter(
        Job.user_id == current_user.id, Application.status == "selected"
    ).scalar()

    return {
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "total_applications": total_apps,
        "shortlisted": shortlisted,
        "scheduled_interviews": interviews,
        "selected": selected,
    }


@router.get("/analytics")
def get_company_analytics(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    job_ids = [j.id for j in jobs]

    apps_per_job = []
    for job in jobs:
        count = db.query(func.count(Application.id)).filter(Application.job_id == job.id).scalar()
        apps_per_job.append({"job_id": job.id, "title": job.title, "count": count})

    status_dist = {}
    for s in ["applied", "under_review", "shortlisted", "interview", "selected", "rejected"]:
        count = db.query(func.count(Application.id)).join(Job).filter(
            Job.user_id == current_user.id, Application.status == s
        ).scalar()
        status_dist[s] = count

    popular = sorted(apps_per_job, key=lambda x: x["count"], reverse=True)[:5]

    return {
        "applications_per_job": apps_per_job,
        "status_distribution": status_dist,
        "most_popular_jobs": popular,
    }


@router.get("/jobs")
def get_company_jobs(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    jobs = db.query(Job).filter(Job.user_id == current_user.id).order_by(Job.created_at.desc()).all()
    results = []
    for job in jobs:
        skills = [js.skill.name for js in job.skills]
        app_count = db.query(func.count(Application.id)).filter(Application.job_id == job.id).scalar()
        results.append({
            "id": job.id, "title": job.title, "description": job.description,
            "responsibilities": job.responsibilities, "requirements": job.requirements,
            "job_type": job.job_type, "work_mode": job.work_mode,
            "location": job.location, "salary_min": job.salary_min,
            "salary_max": job.salary_max, "experience_level": job.experience_level,
            "application_deadline": job.application_deadline,
            "number_of_openings": job.number_of_openings,
            "status": job.status, "total_views": job.total_views,
            "created_at": job.created_at, "updated_at": job.updated_at,
            "skills": skills, "application_count": app_count,
        })
    return {"jobs": results, "total": len(results)}


@router.get("/applicants")
def get_company_applicants(
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).join(Job).filter(Job.user_id == current_user.id).order_by(Application.applied_at.desc()).all()
    results = []
    for app in apps:
        user = app.user
        profile = user.student_profile if user else None
        skills = [ss.skill.name for ss in (user.student_skills if user else [])]
        resume_data = None
        if app.resume:
            resume_data = {"id": app.resume.id, "filename": app.resume.original_filename}

        interview_data = None
        if app.interview:
            interview_data = {
                "id": app.interview.id,
                "interview_date": app.interview.interview_date,
                "interview_type": app.interview.interview_type,
                "meeting_link": app.interview.meeting_link,
                "location": app.interview.location,
                "notes": app.interview.notes,
                "status": app.interview.status,
            }

        results.append({
            "id": app.id,
            "status": app.status,
            "applied_at": app.applied_at,
            "cover_letter": app.cover_letter,
            "student": {
                "id": user.id if user else 0,
                "full_name": user.full_name if user else "",
                "email": user.email if user else "",
                "profile_photo": profile.profile_photo if profile else None,
                "education": profile.education if profile else None,
                "college_university": profile.college_university if profile else None,
                "location": profile.location if profile else None,
                "skills": skills,
            } if user else None,
            "job": {
                "id": app.job.id if app.job else 0,
                "title": app.job.title if app.job else "",
            },
            "resume": resume_data,
            "interview": interview_data,
        })
    return {"applicants": results, "total": len(results)}
