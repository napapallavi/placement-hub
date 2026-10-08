import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { JobListings } from './pages/student/JobListings';
import { MyApplications } from './pages/student/MyApplications';
import { StudentInterviews } from './pages/student/StudentInterviews';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyProfile } from './pages/recruiter/CompanyProfile';
import { PostJob } from './pages/recruiter/PostJob';
import { JobApplicants } from './pages/recruiter/JobApplicants';
import { EligibleStudents } from './pages/recruiter/EligibleStudents';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManageCompanies } from './pages/admin/ManageCompanies';
import { ManageJobs } from './pages/admin/ManageJobs';
import { PlacementDrives } from './pages/admin/PlacementDrives';
import { AllApplicationsMonitor } from './pages/admin/AllApplicationsMonitor';
import { PlacementReports } from './pages/admin/PlacementReports';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStandalonePage = currentPage === 'login' || currentPage.startsWith('register');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register-student':
        return <RegisterPage initialType="student" onNavigate={navigateTo} />;
      case 'register-recruiter':
        return <RegisterPage initialType="recruiter" onNavigate={navigateTo} />;

      // Student views
      case 'student-dashboard':
        return <StudentDashboard onNavigate={navigateTo} />;
      case 'student-profile':
        return <StudentProfile />;
      case 'student-jobs':
        return <JobListings />;
      case 'student-applications':
        return <MyApplications />;
      case 'student-interviews':
        return <StudentInterviews />;

      // Recruiter views
      case 'recruiter-dashboard':
        return <RecruiterDashboard onNavigate={navigateTo} />;
      case 'recruiter-profile':
        return <CompanyProfile />;
      case 'recruiter-post-job':
        return <PostJob onNavigate={navigateTo} />;
      case 'recruiter-applicants':
        return <JobApplicants />;
      case 'recruiter-eligible':
        return <EligibleStudents />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigateTo} />;
      case 'admin-students':
        return <ManageStudents />;
      case 'admin-companies':
        return <ManageCompanies />;
      case 'admin-jobs':
        return <ManageJobs />;
      case 'admin-drives':
        return <PlacementDrives />;
      case 'admin-all-applications':
        return <AllApplicationsMonitor />;
      case 'admin-reports':
        return <PlacementReports />;

      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app-container">
      {!isStandalonePage && sidebarOpen && (
        <Sidebar currentPage={currentPage} onNavigate={navigateTo} />
      )}

      <div className="main-layout">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
        <main className="content-area">{renderCurrentPage()}</main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
