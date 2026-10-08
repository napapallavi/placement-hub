@echo off
echo ========================================================
echo          Placement Hub - Full-Stack Application
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000...
start "Placement Hub Backend" cmd /k "cd backend && .\venv\Scripts\uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React + TypeScript Frontend on http://localhost:5173...
start "Placement Hub Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Placement Hub is running!
echo - Frontend: http://localhost:5173
echo - Backend API & Swagger Docs: http://localhost:8000/docs
echo.
echo Demo Accounts (Password: password123 for all):
echo - Student: student@college.edu
echo - Recruiter: recruiter@google.com
echo - Admin: admin@college.edu
echo ========================================================
