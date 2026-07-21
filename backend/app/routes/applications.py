from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, get_current_student, get_current_company
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.resume import Resume
from app.models.student_skill import StudentSkill
from app.models.skill import Skill
from app.services.notification_service import create_notification
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate

router = APIRouter()


@router.post("")
def create_application(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != "active":
        raise HTTPException(status_code=400, detail="Job is not active")

    from datetime import datetime
    if job.application_deadline and datetime.utcnow() > job.application_deadline:
        raise HTTPException(status_code=400, detail="Application deadline has passed")

    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.job_id == data.job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    application = Application(
        user_id=current_user.id,
        job_id=data.job_id,
        resume_id=data.resume_id,
        cover_letter=data.cover_letter,
        status="applied"
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    company_user_id = job.user_id
    create_notification(
        db, company_user_id,
        "New Application Received",
        f"{current_user.full_name} applied for {job.title}",
        "application",
        application.id
    )

    return {"message": "Application submitted", "application_id": application.id}


@router.get("")
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "student":
        apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    else:
        apps = db.query(Application).join(Job).filter(Job.user_id == current_user.id).all()

    results = []
    for app in apps:
        job = app.job
        company = job.company if job else None
        company_user = company.user if company else None
        user = app.user
        profile = user.student_profile if user else None
        skills = [ss.skill.name for ss in (user.student_skills if user else [])]

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
            "user_id": app.user_id,
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
            "interview": interview_data,
        })

    return {"applications": results, "total": len(results)}


@router.get("/{application_id}")
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == "student" and app.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if current_user.role == "company":
        job = db.query(Job).filter(Job.id == app.job_id, Job.user_id == current_user.id).first()
        if not job:
            raise HTTPException(status_code=403, detail="Not authorized")

    job = app.job
    company = job.company if job else None
    company_user = company.user if company else None
    user = app.user
    profile = user.student_profile if user else None
    skills = [ss.skill.name for ss in (user.student_skills if user else [])]

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

    return {
        "id": app.id, "user_id": app.user_id, "job_id": app.job_id,
        "status": app.status, "applied_at": app.applied_at,
        "cover_letter": app.cover_letter,
        "job": {
            "id": job.id if job else 0, "title": job.title if job else "",
            "job_type": job.job_type if job else "",
            "location": job.location if job else "",
            "company_name": company_user.full_name if company_user else "",
            "company_logo": company.logo if company else None,
        } if job else None,
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
        "interview": interview_data,
    }


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == app.job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=403, detail="Not authorized")

    valid_statuses = ["applied", "under_review", "shortlisted", "interview", "selected", "rejected"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    app.status = data.status
    db.commit()

    status_messages = {
        "under_review": "Your application is under review",
        "shortlisted": "Congratulations! You have been shortlisted",
        "interview": "You have been invited for an interview",
        "selected": "Congratulations! You have been selected",
        "rejected": "We regret to inform you that your application was not selected",
    }

    if data.status in status_messages:
        create_notification(
            db, app.user_id,
            f"Application {data.status.replace('_', ' ').title()}",
            f"Your application for {job.title} - {status_messages[data.status]}",
            "status_update",
            app.id
        )

    return {"message": f"Application status updated to {data.status}"}
