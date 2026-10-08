from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import User, Application, Interview, Student, Company, Notification, ApplicationStatus, UserRole
from app.schemas.schemas import InterviewCreate, InterviewResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.post("", response_model=InterviewResponse)
def schedule_interview(
    interview_in: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == interview_in.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Authorize recruiter or admin
    if current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company or app.job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Unauthorized")
    elif current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Create interview
    interview = Interview(
        application_id=app.id,
        interview_date=interview_in.interview_date,
        interview_mode=interview_in.interview_mode,
        meeting_link_or_venue=interview_in.meeting_link_or_venue,
        round_name=interview_in.round_name,
        feedback=interview_in.feedback,
        status="Scheduled"
    )
    db.add(interview)

    # Automatically progress application to "Interview Scheduled"
    app.status = ApplicationStatus.INTERVIEW_SCHEDULED.value

    # Notify student
    db.add(Notification(
        user_id=app.student.user_id,
        title="Interview Scheduled!",
        message=f"You have been invited for '{interview_in.round_name}' with {app.job.company.company_name} on {interview_in.interview_date.strftime('%b %d, %Y at %I:%M %p')}. Mode: {interview_in.interview_mode}.",
        type="interview"
    ))

    db.commit()
    db.refresh(interview)

    resp = InterviewResponse.model_validate(interview)
    resp.student_name = app.student.user.full_name
    resp.student_roll = app.student.roll_number
    resp.job_title = app.job.title
    resp.company_name = app.job.company.company_name
    return resp

@router.get("/my-schedule", response_model=List[InterviewResponse])
def get_my_interview_schedule(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.STUDENT.value:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            return []
        apps = db.query(Application).filter(Application.student_id == student.id).all()
        app_ids = [a.id for a in apps]
        interviews = db.query(Interview).filter(Interview.application_id.in_(app_ids)).order_by(Interview.interview_date.asc()).all()
    elif current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company:
            return []
        interviews = db.query(Interview).join(Application).join(Company, Company.id == Application.job.has()).all()
        # Better query:
        interviews = db.query(Interview).join(Application).join(Application.job).filter(Application.job.has(company_id=company.id)).order_by(Interview.interview_date.asc()).all()
    else:
        # Admin gets all interviews
        interviews = db.query(Interview).order_by(Interview.interview_date.asc()).all()

    results = []
    for it in interviews:
        resp = InterviewResponse.model_validate(it)
        if it.application:
            resp.student_name = it.application.student.user.full_name if it.application.student and it.application.student.user else "Unknown"
            resp.student_roll = it.application.student.roll_number if it.application.student else ""
            resp.job_title = it.application.job.title if it.application.job else ""
            resp.company_name = it.application.job.company.company_name if it.application.job and it.application.job.company else ""
        results.append(resp)
    return results
