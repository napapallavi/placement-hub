from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import User, Company, Job, Application, Student, UserRole
from app.schemas.schemas import JobCreate, JobUpdate, JobResponse
from app.api.deps import get_current_user, require_recruiter

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("", response_model=List[JobResponse])
def get_jobs(
    search: Optional[str] = None,
    department: Optional[str] = None,
    job_type: Optional[str] = None,
    min_cgpa: Optional[float] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Job).join(Company)

    if status_filter:
        query = query.filter(Job.status == status_filter)
    else:
        # Default show open jobs for students unless recruiter or admin
        if current_user and current_user.role == UserRole.STUDENT.value:
            query = query.filter(Job.status == "Open")

    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) |
            (Company.company_name.ilike(f"%{search}%")) |
            (Job.location.ilike(f"%{search}%"))
        )

    if department and department != "All":
        query = query.filter(
            (Job.department_eligibility.ilike(f"%{department}%")) |
            (Job.department_eligibility.ilike("%All%"))
        )

    if job_type and job_type != "All":
        query = query.filter(Job.job_type == job_type)

    if min_cgpa is not None:
        query = query.filter(Job.min_cgpa <= min_cgpa)

    jobs = query.order_by(Job.created_at.desc()).all()

    # If student is logged in, mark whether applied
    student = None
    if current_user and current_user.role == UserRole.STUDENT.value:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()

    results = []
    for job in jobs:
        resp = JobResponse.model_validate(job)
        resp.company_name = job.company.company_name
        resp.company_location = job.company.location
        resp.applications_count = db.query(Application).filter(Application.job_id == job.id).count()

        if student:
            app = db.query(Application).filter(
                Application.job_id == job.id,
                Application.student_id == student.id
            ).first()
            if app:
                resp.has_applied = True
                resp.application_status = app.status

        results.append(resp)

    return results

@router.get("/company/my-jobs", response_model=List[JobResponse])
def get_recruiter_jobs(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    jobs = db.query(Job).filter(Job.company_id == company.id).order_by(Job.created_at.desc()).all()
    results = []
    for job in jobs:
        resp = JobResponse.model_validate(job)
        resp.company_name = company.company_name
        resp.company_location = company.location
        resp.applications_count = db.query(Application).filter(Application.job_id == job.id).count()
        results.append(resp)
    return results

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(
    job_id: int,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    resp = JobResponse.model_validate(job)
    resp.company_name = job.company.company_name
    resp.company_location = job.company.location
    resp.applications_count = db.query(Application).filter(Application.job_id == job.id).count()

    if current_user and current_user.role == UserRole.STUDENT.value:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student:
            app = db.query(Application).filter(
                Application.job_id == job.id,
                Application.student_id == student.id
            ).first()
            if app:
                resp.has_applied = True
                resp.application_status = app.status

    return resp

@router.post("", response_model=JobResponse)
def create_job(
    job_in: JobCreate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    new_job = Job(
        company_id=company.id,
        title=job_in.title,
        description=job_in.description,
        department_eligibility=job_in.department_eligibility,
        min_cgpa=job_in.min_cgpa,
        salary_package=job_in.salary_package,
        location=job_in.location,
        job_type=job_in.job_type,
        deadline=job_in.deadline,
        status="Open"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    resp = JobResponse.model_validate(new_job)
    resp.company_name = company.company_name
    resp.company_location = company.location
    return resp

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Only admin or the job's company can edit
    if current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company or job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Not authorized to edit this job")
    elif current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if job_in.title is not None: job.title = job_in.title
    if job_in.description is not None: job.description = job_in.description
    if job_in.department_eligibility is not None: job.department_eligibility = job_in.department_eligibility
    if job_in.min_cgpa is not None: job.min_cgpa = job_in.min_cgpa
    if job_in.salary_package is not None: job.salary_package = job_in.salary_package
    if job_in.location is not None: job.location = job_in.location
    if job_in.job_type is not None: job.job_type = job_in.job_type
    if job_in.deadline is not None: job.deadline = job_in.deadline
    if job_in.status is not None: job.status = job_in.status

    db.commit()
    db.refresh(job)

    resp = JobResponse.model_validate(job)
    resp.company_name = job.company.company_name
    resp.company_location = job.company.location
    return resp

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role == UserRole.RECRUITER.value:
        company = db.query(Company).filter(Company.user_id == current_user.id).first()
        if not company or job.company_id != company.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    elif current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Unauthorized")

    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}
