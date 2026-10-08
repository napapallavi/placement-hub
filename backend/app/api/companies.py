from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import User, Company, Job, Application, Interview, UserRole
from app.schemas.schemas import CompanyResponse, CompanyUpdate, RecruiterStatsResponse
from app.api.deps import get_current_user, require_recruiter

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/profile", response_model=CompanyResponse)
def get_my_company_profile(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    
    resp = CompanyResponse.model_validate(company)
    resp.active_jobs_count = db.query(Job).filter(Job.company_id == company.id, Job.status == "Open").count()
    return resp

@router.put("/profile", response_model=CompanyResponse)
def update_company_profile(
    update_data: CompanyUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    if update_data.company_name:
        company.company_name = update_data.company_name
    if update_data.industry:
        company.industry = update_data.industry
    if update_data.website is not None:
        company.website = update_data.website
    if update_data.location:
        company.location = update_data.location
    if update_data.contact_email:
        company.contact_email = update_data.contact_email
    if update_data.description is not None:
        company.description = update_data.description

    db.commit()
    db.refresh(company)
    resp = CompanyResponse.model_validate(company)
    resp.active_jobs_count = db.query(Job).filter(Job.company_id == company.id, Job.status == "Open").count()
    return resp

@router.get("/stats", response_model=RecruiterStatsResponse)
def get_recruiter_stats(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")

    job_ids = [j.id for j in db.query(Job.id).filter(Job.company_id == company.id).all()]
    active_jobs = db.query(Job).filter(Job.company_id == company.id, Job.status == "Open").count()
    
    if not job_ids:
        return {
            "active_jobs": active_jobs,
            "total_applications": 0,
            "shortlisted_candidates": 0,
            "scheduled_interviews": 0,
            "selected_candidates": 0
        }

    apps = db.query(Application).filter(Application.job_id.in_(job_ids)).all()
    total_apps = len(apps)
    shortlisted = sum(1 for a in apps if a.status in ["Shortlisted", "Interview Scheduled", "Selected"])
    interviews = sum(1 for a in apps if a.status == "Interview Scheduled")
    selected = sum(1 for a in apps if a.status == "Selected")

    return {
        "active_jobs": active_jobs,
        "total_applications": total_apps,
        "shortlisted_candidates": shortlisted,
        "scheduled_interviews": interviews,
        "selected_candidates": selected
    }

@router.get("/all", response_model=List[CompanyResponse])
def get_all_companies(
    db: Session = Depends(get_db)
):
    companies = db.query(Company).all()
    results = []
    for c in companies:
        resp = CompanyResponse.model_validate(c)
        resp.active_jobs_count = db.query(Job).filter(Job.company_id == c.id, Job.status == "Open").count()
        results.append(resp)
    return results
