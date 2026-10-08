import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Calendar,
  Building,
  PlusCircle,
  Users,
  GraduationCap,
  CalendarClock,
  BarChart3,
  Layers,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        <button
          className={`nav-item ${currentPage === 'landing' ? 'active' : ''}`}
          onClick={() => onNavigate('landing')}
        >
          <Home size={18} />
          <span>Portal Home</span>
        </button>

        {/* Student Links */}
        {role === 'student' && (
          <>
            <div className="nav-section-title" style={{ marginTop: '12px' }}>
              Student Portal
            </div>
            <button
              className={`nav-item ${currentPage === 'student-dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('student-dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'student-profile' ? 'active' : ''}`}
              onClick={() => onNavigate('student-profile')}
            >
              <User size={18} />
              <span>My Profile & Resume</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'student-jobs' ? 'active' : ''}`}
              onClick={() => onNavigate('student-jobs')}
            >
              <Briefcase size={18} />
              <span>Job Opportunities</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'student-applications' ? 'active' : ''}`}
              onClick={() => onNavigate('student-applications')}
            >
              <FileText size={18} />
              <span>My Applications</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'student-interviews' ? 'active' : ''}`}
              onClick={() => onNavigate('student-interviews')}
            >
              <Calendar size={18} />
              <span>Interview Schedule</span>
            </button>
          </>
        )}

        {/* Recruiter Links */}
        {role === 'recruiter' && (
          <>
            <div className="nav-section-title" style={{ marginTop: '12px' }}>
              Recruiter Portal
            </div>
            <button
              className={`nav-item ${currentPage === 'recruiter-dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('recruiter-dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Recruiter Dashboard</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'recruiter-profile' ? 'active' : ''}`}
              onClick={() => onNavigate('recruiter-profile')}
            >
              <Building size={18} />
              <span>Company Profile</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'recruiter-post-job' ? 'active' : ''}`}
              onClick={() => onNavigate('recruiter-post-job')}
            >
              <PlusCircle size={18} />
              <span>Post New Vacancy</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'recruiter-applicants' ? 'active' : ''}`}
              onClick={() => onNavigate('recruiter-applicants')}
            >
              <Users size={18} />
              <span>Applicants Pipeline</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'recruiter-eligible' ? 'active' : ''}`}
              onClick={() => onNavigate('recruiter-eligible')}
            >
              <GraduationCap size={18} />
              <span>Eligible Students</span>
            </button>
          </>
        )}

        {/* Admin Links */}
        {role === 'admin' && (
          <>
            <div className="nav-section-title" style={{ marginTop: '12px' }}>
              Placement Office (Admin)
            </div>
            <button
              className={`nav-item ${currentPage === 'admin-dashboard' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Overview & Stats</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'admin-students' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-students')}
            >
              <GraduationCap size={18} />
              <span>Manage Students</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'admin-companies' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-companies')}
            >
              <Building size={18} />
              <span>Manage Companies</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'admin-jobs' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-jobs')}
            >
              <Briefcase size={18} />
              <span>Campus Job Postings</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'admin-drives' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-drives')}
            >
              <CalendarClock size={18} />
              <span>Placement Drives</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'admin-all-applications' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-all-applications')}
            >
              <Layers size={18} />
              <span>Monitor Applications</span>
            </button>
            <button
              className={`nav-item ${currentPage === 'admin-reports' ? 'active' : ''}`}
              onClick={() => onNavigate('admin-reports')}
            >
              <BarChart3 size={18} />
              <span>Placement Reports</span>
            </button>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div
          style={{
            padding: '12px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
            Campus Placement Cell
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Session: 2025 - 2026</div>
        </div>
      </div>
    </aside>
  );
};
