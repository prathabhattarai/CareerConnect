import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_student
from app.core.config import get_settings
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.resume import Resume
from app.models.skill import Skill
from app.models.student_skill import StudentSkill
from app.models.application import Application
from app.models.saved_job import SavedJob
from app.schemas.student import StudentProfileUpdate, StudentProfileResponse, AddSkills

router = APIRouter()
settings = get_settings()


@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    skills = db.query(Skill.name).join(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    skill_names = [s[0] for s in skills]

    total_fields = 13
    filled_fields = sum([
        bool(profile.bio),
        bool(profile.education),
        bool(profile.college_university),
        bool(profile.graduation_year),
        bool(profile.location),
        bool(profile.github_link),
        bool(profile.linkedin_link),
        bool(profile.portfolio_link),
        bool(profile.certifications),
        bool(profile.projects),
        bool(profile.work_experience),
        bool(current_user.phone),
        bool(skill_names),
    ])
    completion = round((filled_fields / total_fields) * 100, 1)

    return StudentProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        profile_photo=profile.profile_photo,
        bio=profile.bio,
        education=profile.education,
        college_university=profile.college_university,
        graduation_year=profile.graduation_year,
        location=profile.location,
        github_link=profile.github_link,
        linkedin_link=profile.linkedin_link,
        portfolio_link=profile.portfolio_link,
        certifications=profile.certifications,
        projects=profile.projects,
        work_experience=profile.work_experience,
        created_at=profile.created_at,
        updated_at=profile.updated_at,
        completion_percentage=completion,
        skills=skill_names,
        user_name=current_user.full_name,
        user_email=current_user.email,
        user_phone=current_user.phone or "",
    )


@router.put("/profile", response_model=StudentProfileResponse)
def update_student_profile(
    data: StudentProfileUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.phone is not None:
        current_user.phone = data.phone

    profile_fields = [
        'bio', 'education', 'college_university', 'graduation_year', 'location',
        'github_link', 'linkedin_link', 'portfolio_link', 'certifications',
        'projects', 'work_experience'
    ]
    for field in profile_fields:
        val = getattr(data, field, None)
        if val is not None:
            setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    db.refresh(current_user)

    skills = db.query(Skill.name).join(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    skill_names = [s[0] for s in skills]

    total_fields = 13
    filled_fields = sum([
        bool(profile.bio), bool(profile.education), bool(profile.college_university),
        bool(profile.graduation_year), bool(profile.location), bool(profile.github_link),
        bool(profile.linkedin_link), bool(profile.portfolio_link), bool(profile.certifications),
        bool(profile.projects), bool(profile.work_experience), bool(current_user.phone),
        bool(skill_names),
    ])
    completion = round((filled_fields / total_fields) * 100, 1)

    return StudentProfileResponse(
        id=profile.id, user_id=profile.user_id, profile_photo=profile.profile_photo,
        bio=profile.bio, education=profile.education, college_university=profile.college_university,
        graduation_year=profile.graduation_year, location=profile.location,
        github_link=profile.github_link, linkedin_link=profile.linkedin_link,
        portfolio_link=profile.portfolio_link, certifications=profile.certifications,
        projects=profile.projects, work_experience=profile.work_experience,
        created_at=profile.created_at, updated_at=profile.updated_at,
        completion_percentage=completion, skills=skill_names,
        user_name=current_user.full_name, user_email=current_user.email,
        user_phone=current_user.phone or "",
    )


@router.post("/skills")
def add_skills(
    data: AddSkills,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    for skill_name in data.skills:
        skill = db.query(Skill).filter(Skill.name == skill_name).first()
        if not skill:
            skill = Skill(name=skill_name)
            db.add(skill)
            db.commit()
            db.refresh(skill)

        existing = db.query(StudentSkill).filter(
            StudentSkill.user_id == current_user.id,
            StudentSkill.skill_id == skill.id
        ).first()
        if not existing:
            ss = StudentSkill(
                user_id=current_user.id,
                student_profile_id=profile.id if profile else None,
                skill_id=skill.id
            )
            db.add(ss)

    db.commit()
    return {"message": "Skills added successfully"}


@router.delete("/skills/{skill_name}")
def remove_skill(
    skill_name: str,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.name == skill_name).first()
    if skill:
        db.query(StudentSkill).filter(
            StudentSkill.user_id == current_user.id,
            StudentSkill.skill_id == skill.id
        ).delete()
        db.commit()
    return {"message": "Skill removed"}


@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_RESUME_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: {settings.ALLOWED_RESUME_EXTENSIONS}")

    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size: 5MB")

    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, "resumes", filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(content)

    resume = Resume(
        user_id=current_user.id,
        filename=filename,
        original_filename=file.filename,
        file_path=file_path,
        file_size=len(content)
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {"message": "Resume uploaded", "resume_id": resume.id, "filename": resume.original_filename}


@router.get("/resumes")
def get_resumes(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return [
        {"id": r.id, "filename": r.original_filename, "file_size": r.file_size, "created_at": r.created_at}
        for r in resumes
    ]


@router.delete("/resume/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted"}


@router.get("/applications")
def get_student_applications(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.applied_at.desc()).all()
    results = []
    for app in apps:
        job = app.job
        company = job.company if job else None
        company_user = company.user if company else None
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
            "job_id": app.job_id,
            "status": app.status,
            "applied_at": app.applied_at,
            "cover_letter": app.cover_letter,
            "job": {
                "id": job.id if job else 0,
                "title": job.title if job else "",
                "job_type": job.job_type if job else "",
                "location": job.location if job else "",
                "work_mode": job.work_mode if job else "",
                "company_name": company_user.full_name if company_user else "",
                "company_logo": company.logo if company else None,
            } if job else None,
            "interview": interview_data,
        })
    return {"applications": results, "total": len(results)}


@router.post("/saved-jobs/{job_id}")
def save_job(
    job_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id, SavedJob.job_id == job_id
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"message": "Job unsaved", "saved": False}

    saved = SavedJob(user_id=current_user.id, job_id=job_id)
    db.add(saved)
    db.commit()
    return {"message": "Job saved", "saved": True}


@router.get("/saved-jobs")
def get_saved_jobs(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    saved = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).all()
    results = []
    for s in saved:
        job = s.job
        company = job.company if job else None
        company_user = company.user if company else None
        skills = [js.skill.name for js in (job.skills if job else [])]
        results.append({
            "id": job.id if job else 0,
            "title": job.title if job else "",
            "job_type": job.job_type if job else "",
            "work_mode": job.work_mode if job else "",
            "location": job.location if job else "",
            "salary_min": job.salary_min if job else None,
            "salary_max": job.salary_max if job else None,
            "status": job.status if job else "",
            "created_at": job.created_at if job else None,
            "skills": skills,
            "company": {
                "id": company.id if company else 0,
                "company_name": company_user.full_name if company_user else "",
                "logo": company.logo if company else None,
                "industry": company.industry if company else None,
            } if company else None,
            "saved_at": s.created_at,
        })
    return {"saved_jobs": results, "total": len(results)}
