# 🎓 Placement Hub - College Placement Management System

Placement Hub is an enterprise-grade full-stack web application designed to streamline campus recruitment for universities and colleges. It bridges students, corporate recruiters, and the placement directorate into a unified, responsive platform.

---

## 🚀 Tech Stack

- **Frontend**: React (TypeScript), Vite, Vanilla CSS Design System, Lucide Icons
- **Backend**: FastAPI (Python 3.11+), Pydantic v2
- **Database**: PostgreSQL (with SQLAlchemy ORM and automatic SQLite local dev fallback)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt hashing
- **Containerization**: Docker & Docker Compose

---

## 👥 User Roles & Features

### 1. Student Portal
- **Student Registration & Login**: Roll number, branch, graduation year, and initial CGPA registration.
- **Student Dashboard**: Live application status counts, upcoming interview schedule alerts, and profile completion strength.
- **Profile & Resume Management**: Update phone, bio, technical skills, and upload verified PDF resumes.
- **Campus Job Opportunities**: Browse filterable job catalog with branch eligibility tags and automatic CGPA cutoff checks.
- **1-Click Job Applications**: Submit applications with optional customized cover notes.
- **5-Stage Application Tracker**: Visual stepper displaying:  
  `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Selected / Rejected`
- **Interview Calendar**: View scheduled interview rounds, interview mode (Online vs In-Person), and direct Google Meet join links.
- **In-App Notifications**: Real-time alerts on status transitions, interview invitations, and campus drives.

### 2. Recruiter / Company Portal
- **Recruiter Login & Registration**: Organization credentials, company website, headquarters, and industry domain.
- **Recruiter Dashboard**: Overview of active openings, candidate application volume, and interview pipeline.
- **Company Profile**: Public branding and recruiter contact information.
- **Post Campus Vacancies**: Define job titles, CTC compensation packages, branch eligibility, minimum CGPA cutoff, and deadlines.
- **Applicant Evaluation Pipeline**: Review applicant resumes, student CGPAs, and branch backgrounds.
- **Actionable Evaluation Tools**:
  - Mark candidates *Under Review*
  - *Shortlist* promising profiles
  - *Schedule Interview* with date, round name (Coding, Technical, HR), and meeting link
  - Release campus offer (*Selected*) or update with constructive feedback (*Rejected*)
- **Scout Eligible Students Directory**: Filter university talent pool by minimum CGPA and key technical skill tags (e.g., React, Python, Cloud).

### 3. Placement Officer / Admin Portal
- **Executive Placement Dashboard**: Campus placement percentage, average CTC, highest CTC package, and batch milestones.
- **Department-Wise Performance**: Visual progress bars comparing placed vs unplaced students across each engineering branch.
- **Manage Students Registry**: Filter by branch and placement standing, toggle placement records, and export full student CSV datasets.
- **Manage Companies**: Verify legitimate recruitment partners and review active company vacancy postings.
- **Moderate Job Postings**: Toggle job openings between Open and Closed, or purge inactive posts.
- **Coordinate Placement Drives**: Create on-campus recruitment events, schedule assessment labs, and publish criteria.
- **Campus-Wide Application Monitor**: Audit every application submitted across all companies in real-time.
- **Placement Reports**: CTC salary bracket breakdown, top recruiting companies ranking, and one-click printable official reports.

---

## 🔄 Application Status Flow

Every application strictly traverses the institutional recruitment lifecycle:

```
[Applied] ──► [Under Review] ──► [Shortlisted] ──► [Interview Scheduled] ──► [Selected / Offered]
                                                                        └──► [Rejected]
```

---

## 🗄️ Database Entities

| Entity | Description |
|---|---|
| `users` | Primary auth records (Student, Recruiter, Admin) with hashed passwords |
| `students` | Student details (roll number, department, CGPA, passout year, resume URL, placement status) |
| `companies` | Corporate recruiter profile (company name, industry, website, location, verification) |
| `jobs` | Job postings (title, department eligibility, min CGPA, CTC package, status) |
| `applications`| Application linking student and job with live pipeline status |
| `interviews` | Scheduled interview rounds, mode (Online/In-person), date, meeting URL |
| `resumes` | Candidate uploaded resume attachments |
| `placement_drives` | Scheduled recruitment drives, venue, and criteria |
| `placements` | Verified placement offers and accepted packages |
| `notifications` | Role-specific alerts and status notifications |

---

## 🔑 Demo Accounts

Use any of these pre-seeded accounts (Password: `password123` for all):

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@college.edu` | `password123` | Aarav Patel (CSE, CGPA 9.12) |
| **Recruiter** | `recruiter@google.com` | `password123` | Sarah Jenkins (Google India) |
| **Admin** | `admin@college.edu` | `password123` | Dr. Ramesh Sharma (Placement Director) |

*(Note: The top navigation bar also includes an Instant 1-Click Demo Role Switcher for seamless demonstration).*

---

## ⚡ Quick Start

### Option 1: One-Click Launch (Windows)
Run the included batch launcher:
```bash
start.bat
```
This automatically launches the FastAPI backend on `http://localhost:8000` and the React frontend on `http://localhost:5173`.

### Option 2: Docker Compose (PostgreSQL + FastAPI + React)
```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`
- PostgreSQL: Port `5432`

### Option 3: Manual Startup

**1. Backend (FastAPI):**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**2. Frontend (React + Vite):**
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 REST API Summary

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/recruiter` - Company registration
- `GET /api/students/profile` & `PUT /api/students/profile` - Profile management
- `POST /api/students/resume` - Resume upload endpoint
- `GET /api/jobs` - View available job postings (with filters)
- `POST /api/applications` - Submit job application
- `GET /api/applications/my-applications` - Student application tracker
- `PUT /api/applications/{id}/status` - Update application pipeline stage
- `POST /api/interviews` - Schedule interview rounds
- `GET /api/interviews/my-schedule` - View candidate interview schedule
- `GET /api/admin/stats` - Institutional dashboard statistics
- `GET /api/admin/reports` - Generate placement reports
