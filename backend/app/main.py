from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import get_settings
from app.core.database import engine, Base
from app.routes import api_router

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Job & Internship Portal API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "CareerConnect API is running", "version": settings.APP_VERSION}


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        from app.models.skill import Skill
        default_skills = [
            "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
            "FastAPI", "Django", "Flask", "HTML", "CSS", "Tailwind CSS",
            "SQL", "MySQL", "PostgreSQL", "MongoDB", "Docker", "AWS",
            "Git", "Linux", "Java", "C++", "Go", "Rust", "PHP",
            "Spring Boot", "Angular", "Vue.js", "Svelte", "Flutter",
            "Swift", "Kotlin", "Machine Learning", "Data Science",
            "TensorFlow", "PyTorch", "REST API", "GraphQL", "Redis",
            "Kubernetes", "CI/CD", "Agile", "Scrum",
        ]
        for name in default_skills:
            if not db.query(Skill).filter(Skill.name == name).first():
                db.add(Skill(name=name))
        db.commit()
    finally:
        db.close()
