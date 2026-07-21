from fastapi import APIRouter
from app.routes.auth import router as auth_router
from app.routes.students import router as students_router
from app.routes.companies import router as companies_router
from app.routes.jobs import router as jobs_router
from app.routes.applications import router as applications_router
from app.routes.interviews import router as interviews_router
from app.routes.notifications import router as notifications_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students_router, prefix="/students", tags=["Students"])
api_router.include_router(companies_router, prefix="/companies", tags=["Companies"])
api_router.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
api_router.include_router(interviews_router, prefix="/interviews", tags=["Interviews"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
