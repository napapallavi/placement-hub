import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.entities import User, Student, Application, Interview, Resume, Job, Notification, UserRole
from app.schemas.schemas import StudentResponse, StudentUpdate, StudentStatsResponse
from app.api.deps import get_current_user, require_student

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/profile", response_model=StudentResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    resp = StudentResponse.model_validate(student)
    resp.full_name = current_user.full_name
    resp.email = current_user.email
    return resp

@router.put("/profile", response_model=StudentResponse)
def update_my_profile(
    update_data: StudentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    if update_data.full_name:
        current_user.full_name = update_data.full_name
    if update_data.phone is not None:
        student.phone = update_data.phone
    if update_data.skills is not None:
        student.skills = update_data.skills
    if update_data.bio is not None:
        student.bio = update_data.bio
    if update_data.cgpa is not None:
        student.cgpa = update_data.cgpa
    if update_data.department is not None:
        student.department = update_data.department
    if update_data.graduation_year is not None:
        student.graduation_year = update_data.graduation_year

    db.commit()
    db.refresh(student)
    db.refresh(current_user)

    resp = StudentResponse.model_validate(student)
    resp.full_name = current_user.full_name
    resp.email = current_user.email
    return resp

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    clean_filename = f"resume_{student.id}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(settings.UPLOAD_DIR, clean_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"/api/uploads/resumes/{clean_filename}"
    student.resume_url = file_url

    resume_entry = Resume(
        student_id=student.id,
        file_name=file.filename,
        file_url=file_url
    )
    db.add(resume_entry)
    db.commit()
    db.refresh(student)

    return {"message": "Resume uploaded successfully", "resume_url": file_url, "file_name": file.filename}

@router.get("/stats", response_model=StudentStatsResponse)
def get_student_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    apps = db.query(Application).filter(Application.student_id == student.id).all()
    applied_count = len(apps)
    under_review_count = sum(1 for a in apps if a.status == "Under Review")
    shortlisted_count = sum(1 for a in apps if a.status == "Shortlisted")
    interviews_count = sum(1 for a in apps if a.status == "Interview Scheduled")
    offers_count = sum(1 for a in apps if a.status == "Selected")

    # Profile completion score calculation
    score = 40  # base with registration
    if student.phone: score += 10
    if student.skills: score += 15
    if student.bio: score += 10
    if student.resume_url: score += 25

    return {
        "applied_count": applied_count,
        "under_review_count": under_review_count,
        "shortlisted_count": shortlisted_count,
        "interviews_count": interviews_count,
        "offers_count": offers_count,
        "profile_completion": min(score, 100)
    }

@router.get("/eligible-directory", response_model=List[StudentResponse])
def get_eligible_students_directory(
    department: Optional[str] = None,
    min_cgpa: Optional[float] = None,
    skill: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Recruiter and admin can view eligible students
    query = db.query(Student).join(User)
    if department and department != "All":
        query = query.filter(Student.department == department)
    if min_cgpa is not None:
        query = query.filter(Student.cgpa >= min_cgpa)
    if skill:
        query = query.filter(Student.skills.ilike(f"%{skill}%"))

    students = query.all()
    results = []
    for s in students:
        resp = StudentResponse.model_validate(s)
        resp.full_name = s.user.full_name if s.user else "Unknown"
        resp.email = s.user.email if s.user else ""
        results.append(resp)
    return results
