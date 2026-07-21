from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, get_current_company
from app.models.user import User
from app.models.interview import Interview
from app.models.application import Application
from app.models.job import Job
from app.services.notification_service import create_notification
from app.schemas.interview import InterviewCreate, InterviewUpdate

router = APIRouter()


@router.post("")
def create_interview(
    data: InterviewCreate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == data.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == application.job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=403, detail="Not authorized")

    existing = db.query(Interview).filter(Interview.application_id == data.application_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Interview already scheduled for this application")

    from app.models.company_profile import CompanyProfile
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()

    interview = Interview(
        application_id=data.application_id,
        company_profile_id=profile.id if profile else 0,
        user_id=current_user.id,
        interview_date=data.interview_date,
        interview_type=data.interview_type,
        meeting_link=data.meeting_link,
        location=data.location,
        notes=data.notes,
    )
    db.add(interview)

    application.status = "interview"
    db.commit()
    db.refresh(interview)

    create_notification(
        db, application.user_id,
        "Interview Scheduled",
        f"Your interview for {job.title} has been scheduled on {data.interview_date}",
        "interview",
        interview.id
    )

    return {"message": "Interview scheduled", "interview_id": interview.id}


@router.get("")
def get_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "company":
        interviews = db.query(Interview).filter(Interview.user_id == current_user.id).order_by(Interview.interview_date.desc()).all()
    else:
        interviews = db.query(Interview).join(Application).filter(
            Application.user_id == current_user.id
        ).order_by(Interview.interview_date.desc()).all()

    results = []
    for iv in interviews:
        app = iv.application
        job = app.job if app else None
        student_user = app.user if app else None
        results.append({
            "id": iv.id,
            "application_id": iv.application_id,
            "interview_date": iv.interview_date,
            "interview_type": iv.interview_type,
            "meeting_link": iv.meeting_link,
            "location": iv.location,
            "notes": iv.notes,
            "status": iv.status,
            "created_at": iv.created_at,
            "application": {
                "id": app.id if app else 0,
                "job_title": job.title if job else "",
                "student_name": student_user.full_name if student_user else "",
            } if app else None,
        })

    return {"interviews": results, "total": len(results)}


@router.put("/{interview_id}")
def update_interview(
    interview_id: int,
    data: InterviewUpdate,
    current_user: User = Depends(get_current_company),
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field in ['interview_date', 'interview_type', 'meeting_link', 'location', 'notes', 'status']:
        val = getattr(data, field, None)
        if val is not None:
            setattr(interview, field, val)

    db.commit()
    return {"message": "Interview updated"}
