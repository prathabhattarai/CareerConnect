import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.core.database import get_db
from app.core.security import get_current_user, get_current_company
from app.models.user import User
from app.models.job import Job
from app.models.job_skill import JobSkill
from app.models.skill import Skill
from app.models.company_profile import CompanyProfile
from app.models.application import Application
from app.models.saved_job import SavedJob
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse, SkillOut, CompanyInfo

router = APIRouter()


def build_job_response(job, db, current_user_id=None):
    skills = [SkillOut(id=js.skill.id, name=js.skill.name) for js in job.skills]
    company = job.company
    company_user = company.user if company else None
    company_info = None
    if company:
        company_info = CompanyInfo(
            id=company.id,
            company_name=company_user.full_name if company_user else "",
            logo=company.logo,
            industry=company.industry,
            location=company.location,
            company_size=company.company_size,
        )
    app_count = db.query(func.count(Application.id)).filter(Application.job_id == job.id).scalar()
    is_saved = False
    if current_user_id:
        is_saved = db.query(SavedJob).filter(
            SavedJob.user_id == current_user_id, SavedJob.job_id == job.id
        ).first() is not None

    return JobResponse(
        id=job.id, title=job.title, description=job.description,
        responsibilities=job.responsibilities, requirements=job.requirements,
        job_type=job.job_type, work_mode=job.work_mode, location=job.location,
        salary_min=job.salary_min, salary_max=job.salary_max,
        experience_level=job.experience_level,
        application_deadline=job.application_deadline,
        number_of_openings=job.number_of_openings, status=job.status,
        total_views=job.total_views, created_at=job.created_at,
        updated_at=job.updated_at, skills=skills, company=company_info,
        application_count=app_count, is_saved=is_saved,
    )


@router.get("", response_model=JobListResponse)
def list_jobs(
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=100),
    search: str = Query(None),
    job_type: str = Query(None),
    work_mode: str = Query(None),
    experience_level: str = Query(None),
    salary_min: float = Query(None),
    salary_max: float = Query(None),
    skills: str = Query(None),
    location: str = Query(None),
    status: str = Query("active"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Job)

    if status:
        query = query.filter(Job.status == status)
    else:
        query = query.filter(Job.status.in_(["active", "closed"]))

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Job.title.ilike(search_term),
                Job.description.ilike(search_term),
            )
        )

    if job_type:
        query = query.filter(Job.job_type == job_type)
    if work_mode:
        query = query.filter(Job.work_mode == work_mode)
    if experience_level:
        query = query.filter(Job.experience_level == experience_level)
    if salary_min:
        query = query.filter(Job.salary_max >= salary_min)
    if salary_max:
        query = query.filter(Job.salary_min <= salary_max)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        query = query.join(JobSkill).join(Skill).filter(Skill.name.in_(skill_list))

    total = query.count()
    total_pages = math.ceil(total / per_page) if total > 0 else 1
    jobs = query.order_by(Job.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    unique_jobs = list({j.id: j for j in jobs}.values())

    return JobListResponse(
        jobs=[build_job_response(j, db, current_user.id) for j in unique_jobs],
        total=total, page=page, per_page=per_page, total_pages=total_pages,
    )


@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from app.models.student_skill import StudentSkill

    user_skills = db.query(Skill.name).join(StudentSkill).filter(StudentSkill.user_id == current_user.id).all()
    skill_names = [s[0] for s in user_skills]

    profile = current_user.student_profile
    preferred_location = profile.location if profile else None

    query = db.query(Job).filter(Job.status == "active")

    if skill_names:
        query = query.join(JobSkill).join(Skill).filter(Skill.name.in_(skill_names))

    jobs = query.order_by(Job.created_at.desc()).limit(10).all()
    unique_jobs = list({j.id: j for j in jobs}.values())

    return {"recommendations": [build_job_response(j, db, current_user.id) for j in unique_jobs]}


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.total_views += 1
    db.commit()
    db.refresh(job)

    return build_job_response(job, db, current_user.id)


@router.post("", response_model=JobResponse)
def create_job(
    data: JobCreate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db),
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Company profile not found")

    job = Job(
        company_profile_id=profile.id,
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        responsibilities=data.responsibilities,
        requirements=data.requirements,
        job_type=data.job_type,
        work_mode=data.work_mode,
        location=data.location,
        salary_min=data.salary_min,
        salary_max=data.salary_max,
        experience_level=data.experience_level,
        application_deadline=data.application_deadline,
        number_of_openings=data.number_of_openings,
        status=data.status,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    if data.skills:
        for skill_name in data.skills:
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.add(skill)
                db.commit()
                db.refresh(skill)
            js = JobSkill(job_id=job.id, skill_id=skill.id)
            db.add(js)
        db.commit()

    db.refresh(job)
    return build_job_response(job, db)


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    data: JobUpdate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    for field in ['title', 'description', 'responsibilities', 'requirements', 'job_type',
                  'work_mode', 'location', 'salary_min', 'salary_max', 'experience_level',
                  'application_deadline', 'number_of_openings', 'status']:
        val = getattr(data, field, None)
        if val is not None:
            setattr(job, field, val)

    if data.skills is not None:
        db.query(JobSkill).filter(JobSkill.job_id == job.id).delete()
        for skill_name in data.skills:
            skill = db.query(Skill).filter(Skill.name == skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.add(skill)
                db.commit()
                db.refresh(skill)
            js = JobSkill(job_id=job.id, skill_id=skill.id)
            db.add(js)

    db.commit()
    db.refresh(job)
    return build_job_response(job, db)


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}
