from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, decode_access_token
)
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.company_profile import CompanyProfile
from app.schemas.auth import (
    UserRegister, UserLogin, UserResponse, TokenResponse, PasswordUpdate
)

router = APIRouter()


@router.post("/register/student", response_model=TokenResponse)
def register_student(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        role="student",
        full_name=data.full_name,
        phone=data.phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = StudentProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/register/company", response_model=TokenResponse)
def register_company(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        role="company",
        full_name=data.full_name,
        phone=data.phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = CompanyProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user.id})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.put("/password")
def update_password(
    data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.post("/reset-password")
def reset_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Password reset email sent (simulated)"}
