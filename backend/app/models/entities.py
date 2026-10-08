import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    RECRUITER = "recruiter"
    ADMIN = "admin"

class ApplicationStatus(str, enum.Enum):
    APPLIED = "Applied"
    UNDER_REVIEW = "Under Review"
    SHORTLISTED = "Shortlisted"
    INTERVIEW_SCHEDULED = "Interview Scheduled"
    SELECTED = "Selected"
    REJECTED = "Rejected"

class InterviewMode(str, enum.Enum):
    ONLINE = "Online"
    IN_PERSON = "In-Person"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.STUDENT.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company_profile = relationship("Company", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=False)  # Computer Science, Information Technology, etc.
    cgpa = Column(Float, nullable=False, default=0.0)
    graduation_year = Column(Integer, nullable=False, default=2026)
    phone = Column(String(20), nullable=True)
    skills = Column(Text, nullable=True)  # Comma separated
    resume_url = Column(String(500), nullable=True)
    is_placed = Column(Boolean, default=False)
    current_company = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)

    user = relationship("User", back_populates="student_profile")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="student", cascade="all, delete-orphan")
    placements = relationship("Placement", back_populates="student", cascade="all, delete-orphan")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String(255), nullable=False, index=True)
    industry = Column(String(100), nullable=False)
    website = Column(String(255), nullable=True)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    contact_email = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="company_profile")
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")
    drives = relationship("PlacementDrive", back_populates="company", cascade="all, delete-orphan")
    placements = relationship("Placement", back_populates="company", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    department_eligibility = Column(String(255), nullable=False)  # e.g., "CSE, IT, ECE" or "All"
    min_cgpa = Column(Float, default=0.0)
    salary_package = Column(String(100), nullable=False)  # e.g., "12.5 LPA"
    location = Column(String(255), nullable=False)
    job_type = Column(String(50), default="Full-Time")  # Full-Time, Internship, Contract
    deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default="Open")  # Open, Closed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    placements = relationship("Placement", back_populates="job", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    status = Column(String(50), default=ApplicationStatus.APPLIED.value, nullable=False)
    cover_note = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    job = relationship("Job", back_populates="applications")
    student = relationship("Student", back_populates="applications")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    interview_date = Column(DateTime, nullable=False)
    interview_mode = Column(String(50), default=InterviewMode.ONLINE.value)
    meeting_link_or_venue = Column(String(500), nullable=False)
    round_name = Column(String(100), nullable=False)  # Round 1: Coding, HR Round, etc.
    feedback = Column(Text, nullable=True)
    status = Column(String(50), default="Scheduled")  # Scheduled, Completed, Cancelled
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application", back_populates="interviews")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="resumes")

class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    drive_date = Column(DateTime, nullable=False)
    venue = Column(String(255), nullable=False)  # e.g., "Auditorium Hall A & Online"
    eligibility_criteria = Column(String(255), nullable=False)
    status = Column(String(50), default="Upcoming")  # Upcoming, Ongoing, Completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="drives")

class Placement(Base):
    __tablename__ = "placements"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    package_offered = Column(String(100), nullable=False)
    offer_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(50), default="Accepted")  # Accepted, Pending, Declined

    student = relationship("Student", back_populates="placements")
    job = relationship("Job", back_populates="placements")
    company = relationship("Company", back_populates="placements")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    type = Column(String(50), default="info")  # info, success, warning, interview, alert
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
