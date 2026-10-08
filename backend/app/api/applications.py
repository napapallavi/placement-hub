from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import (
    User, Student, Company, Job, Application, Interview, Placement,
    Notification, ApplicationStatus, UserRole
)
from app.schemas.schemas import (
    ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse, InterviewResponse
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("", response_model=ApplicationResponse)
def apply_for_job(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Only registered students can apply for jobs")

    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != "Open":
        raise HTTPException(status_code=400, detail="This job opening is no longer accepting applications")

    existing_app = db.query(Application).filter(
        Application.job_id == job.id,
        Application.student_id == student.id
    ).first()
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this position")

    # Eligibility check
    if student.cgpa < job.min_cgpa:
        raise HTTPException(
            status_code=400, 
            detail=f"Minimum CGPA requirement is {job.min_cgpa}. Your CGPA is {student.cgpa}."
        )

    # Department check if not 'All'
    if "All" not in job.department_eligibility and student.department.lower() not in job.department_eligibility.lower():
        raise HTTPException(
            status_code=400,
            detail=f"Eligible departments are: {job.department_eligibility}. Your department is {student.department}."
        )

    application = Application(
        job_id=job.id,
        student_id=student.id,
        status=ApplicationStatus.APPLIED.value,
        cover_note=app_in.cover_note
    )
    db.add(application)
    db.flush()

    # Create notification for student
    db.add(Notification(
        user_id=student.user_id,
        title="Application Submitted",
        message=f"You successfully applied for {job.title} at {job.company.company_name}.",
        type="info"
    ))

    # Create notification for recruiter
    db.add(Notification(
        user_id=job.company.user_id,
        title="New Application Received",
        message=f"{current_user.full_name} applied for {job.title}.",
        type="info"
    ))

    db.commit()
    db.refresh(application)

    return format_application_response(application)

@router.get("/my-applications", response_model=List[ApplicationResponse])
def get_student_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    apps = db.query(Application).filter(Application.student_id == student.id).order_by(Application.applied_at.desc()).all()
    return [format_application_response(a) for a in apps]

@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def get_applications_for_job(
    job_id: int,
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company or job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Unauthorized to view applicants for this job")
    elif current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Unauthorized")

    query = db.query(Application).filter(Application.job_id == job_id)
    if status_filter:
        query = query.filter(Application.status == status_filter)

    apps = query.order_by(Application.applied_at.desc()).all()
    return [format_application_response(a) for a in apps]

@router.get("/recruiter/all", response_model=List[ApplicationResponse])
def get_all_recruiter_applications(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    query = db.query(Application).join(Job).filter(Job.company_id == company.id)
    if status_filter:
        query = query.filter(Application.status == status_filter)

    apps = query.order_by(Application.applied_at.desc()).all()
    return [format_application_response(a) for a in apps]

@router.get("/admin/all", response_model=List[ApplicationResponse])
def get_all_institution_applications(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Admin access required")

    query = db.query(Application)
    if status_filter:
        query = query.filter(Application.status == status_filter)

    apps = query.order_by(Application.applied_at.desc()).all()
    return [format_application_response(a) for a in apps]

@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    valid_statuses = [s.value for s in ApplicationStatus]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status_update.status}'. Allowed: {', '.join(valid_statuses)}"
        )

    # Check permission
    if current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company or app.job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this application")
    elif current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Unauthorized")

    old_status = app.status
    app.status = status_update.status
    app.updated_at = datetime.now(timezone.utc)

    # If selected, register placement record
    if status_update.status == ApplicationStatus.SELECTED.value and old_status != ApplicationStatus.SELECTED.value:
        student = app.student
        student.is_placed = True
        student.current_company = app.job.company.company_name
        
        # Check if placement record already exists
        existing_placement = db.query(Placement).filter(
            Placement.student_id == student.id,
            Placement.job_id == app.job_id
        ).first()
        if not existing_placement:
            placement = Placement(
                student_id=student.id,
                job_id=app.job_id,
                company_id=app.job.company_id,
                package_offered=app.job.salary_package,
                offer_date=datetime.now(timezone.utc),
                status="Accepted"
            )
            db.add(placement)

    # Notify student
    notif_type = "success" if status_update.status == ApplicationStatus.SELECTED.value else (
        "warning" if status_update.status == ApplicationStatus.REJECTED.value else "info"
    )
    feedback_text = f" Feedback: {status_update.feedback}" if status_update.feedback else ""
    
    db.add(Notification(
        user_id=app.student.user_id,
        title=f"Application Update: {status_update.status}",
        message=f"Your application status for {app.job.title} at {app.job.company.company_name} has changed to '{status_update.status}'.{feedback_text}",
        type=notif_type
    ))

    db.commit()
    db.refresh(app)
    return format_application_response(app)

def format_application_response(app: Application) -> ApplicationResponse:
    interviews_resp = []
    for it in app.interviews:
        ir = InterviewResponse.model_validate(it)
        interviews_resp.append(ir)

    resp = ApplicationResponse(
        id=app.id,
        job_id=app.job_id,
        student_id=app.student_id,
        status=app.status,
        cover_note=app.cover_note,
        applied_at=app.applied_at,
        updated_at=app.updated_at,
        job_title=app.job.title if app.job else None,
        company_name=app.job.company.company_name if app.job and app.job.company else None,
        company_location=app.job.company.location if app.job and app.job.company else None,
        salary_package=app.job.salary_package if app.job else None,
        student_name=app.student.user.full_name if app.student and app.student.user else None,
        student_email=app.student.user.email if app.student and app.student.user else None,
        student_roll=app.student.roll_number if app.student else None,
        student_cgpa=app.student.cgpa if app.student else None,
        student_department=app.student.department if app.student else None,
        student_skills=app.student.skills if app.student else None,
        resume_url=app.student.resume_url if app.student else None,
        interviews=interviews_resp
    )
    return resp
