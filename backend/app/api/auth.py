from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.entities import User, Student, Company, UserRole, Notification
from app.schemas.schemas import LoginRequest, TokenResponse, StudentRegisterRequest, RecruiterRegisterRequest, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower()).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")
    
    token = create_access_token(user.id)
    
    # Pack user info
    user_info = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }
    
    if user.role == UserRole.STUDENT.value and user.student_profile:
        user_info["student_id"] = user.student_profile.id
        user_info["roll_number"] = user.student_profile.roll_number
        user_info["department"] = user.student_profile.department
        user_info["cgpa"] = user.student_profile.cgpa
    elif user.role == UserRole.RECRUITER.value and user.company_profile:
        user_info["company_id"] = user.company_profile.id
        user_info["company_name"] = user.company_profile.company_name
        user_info["is_verified"] = user.company_profile.is_verified
        
    return {"access_token": token, "token_type": "bearer", "user": user_info}

@router.post("/register/student", response_model=TokenResponse)
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    roll_check = db.query(Student).filter(Student.roll_number == req.roll_number.upper()).first()
    if roll_check:
        raise HTTPException(status_code=400, detail="Roll number already registered")
    
    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=UserRole.STUDENT.value,
        is_active=True,
    )
    db.add(user)
    db.flush()
    
    student = Student(
        user_id=user.id,
        roll_number=req.roll_number.upper(),
        department=req.department,
        cgpa=req.cgpa,
        graduation_year=req.graduation_year,
        phone=req.phone,
        skills=req.skills,
    )
    db.add(student)
    
    # Welcome notification
    welcome_notif = Notification(
        user_id=user.id,
        title="Welcome to Placement Hub!",
        message="Your student profile has been created. Complete your resume and explore jobs.",
        type="info"
    )
    db.add(welcome_notif)
    
    db.commit()
    db.refresh(user)
    db.refresh(student)
    
    token = create_access_token(user.id)
    user_info = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "student_id": student.id,
        "roll_number": student.roll_number,
        "department": student.department,
        "cgpa": student.cgpa,
    }
    return {"access_token": token, "token_type": "bearer", "user": user_info}

@router.post("/register/recruiter", response_model=TokenResponse)
def register_recruiter(req: RecruiterRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=UserRole.RECRUITER.value,
        is_active=True,
    )
    db.add(user)
    db.flush()
    
    company = Company(
        user_id=user.id,
        company_name=req.company_name,
        industry=req.industry,
        website=req.website,
        location=req.location,
        contact_email=req.contact_email,
        description=req.description,
        is_verified=True,  # Auto-verify or wait for admin
    )
    db.add(company)
    
    # Welcome notification
    db.add(Notification(
        user_id=user.id,
        title="Recruiter Account Created",
        message="Welcome to Placement Hub. Start posting vacancies and hire talented candidates.",
        type="success"
    ))
    
    db.commit()
    db.refresh(user)
    db.refresh(company)
    
    token = create_access_token(user.id)
    user_info = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "company_id": company.id,
        "company_name": company.company_name,
        "is_verified": company.is_verified,
    }
    return {"access_token": token, "token_type": "bearer", "user": user_info}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    user_info = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
    }
    if current_user.role == UserRole.STUDENT.value and current_user.student_profile:
        user_info["student_id"] = current_user.student_profile.id
        user_info["roll_number"] = current_user.student_profile.roll_number
        user_info["department"] = current_user.student_profile.department
        user_info["cgpa"] = current_user.student_profile.cgpa
        user_info["resume_url"] = current_user.student_profile.resume_url
    elif current_user.role == UserRole.RECRUITER.value and current_user.company_profile:
        user_info["company_id"] = current_user.company_profile.id
        user_info["company_name"] = current_user.company_profile.company_name
        user_info["is_verified"] = current_user.company_profile.is_verified
    return user_info
