from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class StudentRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    roll_number: str
    department: str
    cgpa: float
    graduation_year: int
    phone: Optional[str] = None
    skills: Optional[str] = None

class RecruiterRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: str
    industry: str
    website: Optional[str] = None
    location: str
    contact_email: EmailStr
    description: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Student Schemas ---
class StudentBase(BaseModel):
    roll_number: str
    department: str
    cgpa: float
    graduation_year: int
    phone: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[str] = None
    bio: Optional[str] = None
    cgpa: Optional[float] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None

class StudentResponse(BaseModel):
    id: int
    user_id: int
    roll_number: str
    department: str
    cgpa: float
    graduation_year: int
    phone: Optional[str] = None
    skills: Optional[str] = None
    resume_url: Optional[str] = None
    is_placed: bool
    current_company: Optional[str] = None
    bio: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True

# --- Company Schemas ---
class CompanyBase(BaseModel):
    company_name: str
    industry: str
    website: Optional[str] = None
    location: str
    contact_email: str
    description: Optional[str] = None

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
    description: Optional[str] = None

class CompanyResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    industry: str
    website: Optional[str] = None
    location: str
    contact_email: str
    description: Optional[str] = None
    is_verified: bool
    created_at: datetime
    active_jobs_count: Optional[int] = 0

    class Config:
        from_attributes = True

# --- Job Schemas ---
class JobCreate(BaseModel):
    title: str
    description: str
    department_eligibility: str
    min_cgpa: float = 0.0
    salary_package: str
    location: str
    job_type: str = "Full-Time"
    deadline: Optional[datetime] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    department_eligibility: Optional[str] = None
    min_cgpa: Optional[float] = None
    salary_package: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    company_id: int
    company_name: Optional[str] = None
    company_location: Optional[str] = None
    title: str
    description: str
    department_eligibility: str
    min_cgpa: float
    salary_package: str
    location: str
    job_type: str
    deadline: Optional[datetime] = None
    status: str
    created_at: datetime
    applications_count: Optional[int] = 0
    has_applied: Optional[bool] = False
    application_status: Optional[str] = None

    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    job_id: int
    cover_note: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str  # Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected
    feedback: Optional[str] = None

class InterviewCreate(BaseModel):
    application_id: int
    interview_date: datetime
    interview_mode: str = "Online"
    meeting_link_or_venue: str
    round_name: str
    feedback: Optional[str] = None

class InterviewResponse(BaseModel):
    id: int
    application_id: int
    interview_date: datetime
    interview_mode: str
    meeting_link_or_venue: str
    round_name: str
    feedback: Optional[str] = None
    status: str
    created_at: datetime
    student_name: Optional[str] = None
    student_roll: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    student_id: int
    status: str
    cover_note: Optional[str] = None
    applied_at: datetime
    updated_at: datetime
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    company_location: Optional[str] = None
    salary_package: Optional[str] = None
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    student_roll: Optional[str] = None
    student_cgpa: Optional[float] = None
    student_department: Optional[str] = None
    student_skills: Optional[str] = None
    resume_url: Optional[str] = None
    interviews: Optional[List[InterviewResponse]] = []

    class Config:
        from_attributes = True

# --- Drive Schemas ---
class PlacementDriveCreate(BaseModel):
    title: str
    description: Optional[str] = None
    company_id: Optional[int] = None
    drive_date: datetime
    venue: str
    eligibility_criteria: str
    status: str = "Upcoming"

class PlacementDriveResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    company_id: Optional[int] = None
    company_name: Optional[str] = None
    drive_date: datetime
    venue: str
    eligibility_criteria: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    is_read: bool
    type: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Dashboard & Report Schemas ---
class AdminStatsResponse(BaseModel):
    total_students: int
    placed_students: int
    placement_rate: float
    total_companies: int
    total_jobs: int
    total_applications: int
    highest_package: str
    average_package: str
    department_stats: List[Dict[str, Any]]
    status_distribution: Dict[str, int]
    recent_placements: List[Dict[str, Any]]

class StudentStatsResponse(BaseModel):
    applied_count: int
    under_review_count: int
    shortlisted_count: int
    interviews_count: int
    offers_count: int
    profile_completion: int

class RecruiterStatsResponse(BaseModel):
    active_jobs: int
    total_applications: int
    shortlisted_candidates: int
    scheduled_interviews: int
    selected_candidates: int
