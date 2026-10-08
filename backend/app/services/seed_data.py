from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.entities import (
    User, Student, Company, Job, Application, Interview, Placement,
    PlacementDrive, Notification, UserRole, ApplicationStatus, InterviewMode
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).count() > 0:
        return

    print("Seeding initial Placement Hub demo data...")
    default_pwd = hash_password("password123")

    # 1. Admin User
    admin_user = User(
        email="admin@college.edu",
        hashed_password=default_pwd,
        full_name="Dr. Ramesh Sharma (Placement Director)",
        role=UserRole.ADMIN.value,
        is_active=True
    )
    db.add(admin_user)

    # 2. Recruiter Users & Companies
    recruiter_google = User(
        email="recruiter@google.com",
        hashed_password=default_pwd,
        full_name="Sarah Jenkins (Head of University Talent)",
        role=UserRole.RECRUITER.value,
        is_active=True
    )
    db.add(recruiter_google)
    db.flush()

    google_co = Company(
        user_id=recruiter_google.id,
        company_name="Google India",
        industry="Technology & Cloud Computing",
        website="https://careers.google.com",
        location="Bengaluru & Hyderabad",
        contact_email="university-recruiting@google.com",
        description="Google builds products to help organize the world's information and make it universally accessible and useful.",
        is_verified=True
    )
    db.add(google_co)

    recruiter_ms = User(
        email="recruiter@microsoft.com",
        hashed_password=default_pwd,
        full_name="David Miller (Campus Lead)",
        role=UserRole.RECRUITER.value,
        is_active=True
    )
    db.add(recruiter_ms)
    db.flush()

    ms_co = Company(
        user_id=recruiter_ms.id,
        company_name="Microsoft",
        industry="Software & Enterprise Cloud",
        website="https://careers.microsoft.com",
        location="Hyderabad & Bengaluru",
        contact_email="campus-india@microsoft.com",
        description="Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
        is_verified=True
    )
    db.add(ms_co)

    recruiter_amazon = User(
        email="recruiter@amazon.com",
        hashed_password=default_pwd,
        full_name="Anita Roy (Senior Talent Scout)",
        role=UserRole.RECRUITER.value,
        is_active=True
    )
    db.add(recruiter_amazon)
    db.flush()

    amazon_co = Company(
        user_id=recruiter_amazon.id,
        company_name="Amazon",
        industry="E-Commerce & AWS Cloud",
        website="https://amazon.jobs",
        location="Bengaluru & Chennai",
        contact_email="campus-hire@amazon.com",
        description="Guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
        is_verified=True
    )
    db.add(amazon_co)

    # 3. Student Users
    students_data = [
        {
            "email": "student@college.edu",
            "name": "Aarav Patel",
            "roll": "22CS101",
            "dept": "Computer Science & Engineering",
            "cgpa": 9.12,
            "skills": "React, TypeScript, Python, FastAPI, Docker, PostgreSQL, Data Structures",
            "bio": "Final year CSE undergraduate enthusiastic about scalable systems and frontend engineering.",
            "phone": "+91 98765 43210"
        },
        {
            "email": "priya.sharma@college.edu",
            "name": "Priya Sharma",
            "roll": "22IT104",
            "dept": "Information Technology",
            "cgpa": 8.85,
            "skills": "Java, Spring Boot, Microservices, AWS, SQL, Kubernetes",
            "bio": "Passionate backend engineer with project experience in distributed databases.",
            "phone": "+91 98765 43211"
        },
        {
            "email": "rohit.verma@college.edu",
            "name": "Rohit Verma",
            "roll": "22EC205",
            "dept": "Electronics & Communication",
            "cgpa": 7.95,
            "skills": "Embedded C, IoT, Python, Machine Learning, Signal Processing",
            "bio": "Interested in firmware engineering and AI on edge computing devices.",
            "phone": "+91 98765 43212"
        },
        {
            "email": "ananya.singh@college.edu",
            "name": "Ananya Singh",
            "roll": "22CS142",
            "dept": "Computer Science & Engineering",
            "cgpa": 9.40,
            "skills": "Golang, Distributed Systems, Redis, GraphQL, React",
            "bio": "ACM-ICPC regionalist and open-source contributor passionate about distributed caches.",
            "phone": "+91 98765 43213"
        },
        {
            "email": "karan.mehta@college.edu",
            "name": "Karan Mehta",
            "roll": "22ME310",
            "dept": "Mechanical Engineering",
            "cgpa": 8.35,
            "skills": "Robotics, Python, CAD/CAM, Automation, Mechatronics",
            "bio": "Robotics enthusiast aiming for automation engineering and industrial software.",
            "phone": "+91 98765 43214"
        }
    ]

    created_students = []
    for s_info in students_data:
        u = User(
            email=s_info["email"],
            hashed_password=default_pwd,
            full_name=s_info["name"],
            role=UserRole.STUDENT.value,
            is_active=True
        )
        db.add(u)
        db.flush()

        st = Student(
            user_id=u.id,
            roll_number=s_info["roll"],
            department=s_info["dept"],
            cgpa=s_info["cgpa"],
            graduation_year=2026,
            phone=s_info["phone"],
            skills=s_info["skills"],
            bio=s_info["bio"],
            resume_url="/uploads/resumes/sample_resume.pdf"
        )
        db.add(st)
        created_students.append(st)

    db.flush()

    # 4. Job Vacancies
    now = datetime.now(timezone.utc)
    jobs_data = [
        {
            "company_id": google_co.id,
            "title": "Software Development Engineer (SDE-1)",
            "description": "Design, develop, test, deploy, maintain, and enhance large-scale distributed software solutions across Google Cloud and Core Products. Candidates will work with modern programming paradigms and large datasets.",
            "dept": "Computer Science & Engineering, Information Technology",
            "cgpa": 8.0,
            "salary": "32.5 LPA",
            "location": "Bengaluru (Hybrid)",
            "type": "Full-Time",
            "deadline": now + timedelta(days=25)
        },
        {
            "company_id": google_co.id,
            "title": "Cloud Technical Solutions Engineer",
            "description": "Troubleshoot technical issues for enterprise Google Cloud Platform customers, design automation tools, and collaborate closely with product management and site reliability teams.",
            "dept": "All",
            "cgpa": 7.5,
            "salary": "22.0 LPA",
            "location": "Hyderabad",
            "type": "Full-Time",
            "deadline": now + timedelta(days=20)
        },
        {
            "company_id": ms_co.id,
            "title": "Software Engineer - Azure Core",
            "description": "Build high-throughput hyper-scale cloud microservices powering Azure infrastructure. Requires solid algorithmic problem solving and experience in systems programming or backend frameworks.",
            "dept": "Computer Science & Engineering, Information Technology, Electronics & Communication",
            "cgpa": 8.0,
            "salary": "28.0 LPA",
            "location": "Hyderabad (Hybrid)",
            "type": "Full-Time",
            "deadline": now + timedelta(days=30)
        },
        {
            "company_id": ms_co.id,
            "title": "Product Engineering Intern (Summer 2026)",
            "description": "6-month internship on developer experience tools and Microsoft 365 copilot integrations. Fast-track conversion to full-time SDE upon graduation.",
            "dept": "All",
            "cgpa": 7.0,
            "salary": "1.25 Lakhs / month",
            "location": "Bengaluru",
            "type": "Internship",
            "deadline": now + timedelta(days=15)
        },
        {
            "company_id": amazon_co.id,
            "title": "Software Development Engineer - AWS",
            "description": "Join AWS services engineering teams to architect fault-tolerant distributed cloud services handling millions of operations per second globally.",
            "dept": "Computer Science & Engineering, Information Technology",
            "cgpa": 7.5,
            "salary": "30.0 LPA",
            "location": "Bengaluru",
            "type": "Full-Time",
            "deadline": now + timedelta(days=28)
        },
        {
            "company_id": amazon_co.id,
            "title": "Applied Scientist - Machine Learning",
            "description": "Develop state-of-the-art NLP and recommendation algorithms for Amazon Retail & Prime Video platforms.",
            "dept": "Computer Science & Engineering, Electronics & Communication",
            "cgpa": 8.5,
            "salary": "44.0 LPA",
            "location": "Bengaluru",
            "type": "Full-Time",
            "deadline": now + timedelta(days=35)
        }
    ]

    created_jobs = []
    for jd in jobs_data:
        jb = Job(
            company_id=jd["company_id"],
            title=jd["title"],
            description=jd["description"],
            department_eligibility=jd["dept"],
            min_cgpa=jd["cgpa"],
            salary_package=jd["salary"],
            location=jd["location"],
            job_type=jd["type"],
            deadline=jd["deadline"],
            status="Open"
        )
        db.add(jb)
        created_jobs.append(jb)

    db.flush()

    # 5. Applications across stages
    aarav = created_students[0]
    priya = created_students[1]
    rohit = created_students[2]
    ananya = created_students[3]

    job_google_sde = created_jobs[0]
    job_ms_azure = created_jobs[2]
    job_amazon_aws = created_jobs[4]
    job_google_cloud = created_jobs[1]

    # App 1: Aarav -> Google SDE (Interview Scheduled)
    app1 = Application(
        job_id=job_google_sde.id,
        student_id=aarav.id,
        status=ApplicationStatus.INTERVIEW_SCHEDULED.value,
        cover_note="Excited about building high-scale distributed systems and contributing to Google Cloud.",
        applied_at=now - timedelta(days=5)
    )
    db.add(app1)
    db.flush()

    # Interview for App 1
    interview1 = Interview(
        application_id=app1.id,
        interview_date=now + timedelta(days=2, hours=4),
        interview_mode=InterviewMode.ONLINE.value,
        meeting_link_or_venue="https://meet.google.com/xyz-placement-2026",
        round_name="Technical Round 1: Algorithms & Data Structures",
        feedback="Resume shortlisted. High problem solving scores in preliminary online assessment.",
        status="Scheduled"
    )
    db.add(interview1)

    # App 2: Aarav -> MS Azure (Shortlisted)
    app2 = Application(
        job_id=job_ms_azure.id,
        student_id=aarav.id,
        status=ApplicationStatus.SHORTLISTED.value,
        cover_note="Strong interest in distributed storage and cloud virtualization.",
        applied_at=now - timedelta(days=7)
    )
    db.add(app2)

    # App 3: Aarav -> Amazon AWS (Applied)
    app3 = Application(
        job_id=job_amazon_aws.id,
        student_id=aarav.id,
        status=ApplicationStatus.APPLIED.value,
        cover_note="Application submitted through on-campus recruitment.",
        applied_at=now - timedelta(days=1)
    )
    db.add(app3)

    # App 4: Priya -> MS Azure (Selected / Offer made)
    app4 = Application(
        job_id=job_ms_azure.id,
        student_id=priya.id,
        status=ApplicationStatus.SELECTED.value,
        cover_note="Specialized in cloud microservices and concurrent data handling.",
        applied_at=now - timedelta(days=12)
    )
    db.add(app4)
    priya.is_placed = True
    priya.current_company = "Microsoft"

    placement1 = Placement(
        student_id=priya.id,
        job_id=job_ms_azure.id,
        company_id=ms_co.id,
        package_offered="28.0 LPA",
        offer_date=now - timedelta(days=2),
        status="Accepted"
    )
    db.add(placement1)

    # App 5: Ananya -> Google SDE (Shortlisted)
    app5 = Application(
        job_id=job_google_sde.id,
        student_id=ananya.id,
        status=ApplicationStatus.SHORTLISTED.value,
        cover_note="Passionate about low-latency caching and distributed RPC frameworks.",
        applied_at=now - timedelta(days=4)
    )
    db.add(app5)

    # App 6: Rohit -> Google Cloud (Under Review)
    app6 = Application(
        job_id=job_google_cloud.id,
        student_id=rohit.id,
        status=ApplicationStatus.UNDER_REVIEW.value,
        cover_note="Focusing on IoT edge gateways and cloud infrastructure.",
        applied_at=now - timedelta(days=3)
    )
    db.add(app6)

    # 6. Placement Drives
    drive1 = PlacementDrive(
        title="Google Mega Campus Recruitment 2026",
        description="Annual campus recruitment drive for final year B.Tech and M.Tech candidates for SDE & Cloud roles.",
        company_id=google_co.id,
        drive_date=now + timedelta(days=7),
        venue="Auditorium Hall A & Online Coding Lab",
        eligibility_criteria="B.Tech (CSE, IT, ECE) with CGPA >= 7.5 and no active backlogs",
        status="Upcoming"
    )
    db.add(drive1)

    drive2 = PlacementDrive(
        title="Microsoft Sprint Hiring Wave",
        description="Comprehensive technical interviews and direct campus offers for Azure and Core OS engineering teams.",
        company_id=ms_co.id,
        drive_date=now + timedelta(days=14),
        venue="Central Seminar Complex - Floor 3",
        eligibility_criteria="All B.Tech branches with CGPA >= 7.5",
        status="Upcoming"
    )
    db.add(drive2)

    drive3 = PlacementDrive(
        title="Amazon AWS FinTech & Cloud Drive",
        description="High-velocity recruitment drive for AWS Cloud and Applied Science divisions.",
        company_id=amazon_co.id,
        drive_date=now + timedelta(days=21),
        venue="Virtual / Online Assessment Center",
        eligibility_criteria="CGPA >= 8.0 with strong coding proficiency",
        status="Upcoming"
    )
    db.add(drive3)

    # 7. Notifications
    db.add(Notification(
        user_id=aarav.user_id,
        title="Interview Scheduled with Google!",
        message="Your Technical Round 1 for Software Development Engineer (SDE-1) has been scheduled. Check your interview schedule tab.",
        type="interview"
    ))
    db.add(Notification(
        user_id=aarav.user_id,
        title="Shortlisted for Microsoft Azure",
        message="Congratulations! Your profile has been shortlisted for the Software Engineer - Azure Core role.",
        type="success"
    ))
    db.add(Notification(
        user_id=priya.user_id,
        title="Offer Letter Issued: Microsoft",
        message="Congratulations! Microsoft has selected you for the Software Engineer position with 28.0 LPA CTC.",
        type="success"
    ))
    db.add(Notification(
        user_id=admin_user.id,
        title="New Drive Scheduled",
        message="Google India confirmed on-campus recruitment drive for next week.",
        type="info"
    ))

    db.commit()
    print("Placement Hub initial demo data seeded successfully!")
