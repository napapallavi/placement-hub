import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  ArrowRight,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, quickSwitchRole } = useAuth();

  const handleRoleEnter = (role: 'student' | 'recruiter' | 'admin') => {
    quickSwitchRole(role);
    if (role === 'student') onNavigate('student-dashboard');
    else if (role === 'recruiter') onNavigate('recruiter-dashboard');
    else onNavigate('admin-dashboard');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Hero Strip */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 40px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            <Award size={16} /> Campus Recruitment Session 2025 - 2026
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
            Placement Hub
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '28px' }}>
            The central college placement management portal connecting ambitious students, premier recruiters, and the placement directorate in one seamless ecosystem.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-lg"
              style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}
              onClick={() => handleRoleEnter('student')}
            >
              Enter as Student <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-lg btn-outline"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
              onClick={() => handleRoleEnter('recruiter')}
            >
              Recruiter Portal
            </button>
            <button
              className="btn btn-lg btn-outline"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
              onClick={() => handleRoleEnter('admin')}
            >
              Placement Officer
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="metric-strip" style={{ marginBottom: '32px' }}>
        <div className="metric-item">
          <div className="metric-label">
            Placement Rate <TrendingUp size={16} color="#10b981" />
          </div>
          <div className="metric-value">94.2%</div>
          <div className="metric-sub">Class of 2026</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Highest Package <Award size={16} color="#f59e0b" />
          </div>
          <div className="metric-value">44.0 LPA</div>
          <div className="metric-sub">Applied Scientist, Amazon</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Average Package <Briefcase size={16} color="#2563eb" />
          </div>
          <div className="metric-value">12.8 LPA</div>
          <div className="metric-sub">Across all departments</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Participating Companies <Building2 size={16} color="#7c3aed" />
          </div>
          <div className="metric-value">120+</div>
          <div className="metric-sub">Fortune 500 & Unicorns</div>
        </div>
      </div>

      {/* Three Pillars Portal Entry */}
      <div className="integrated-panel" style={{ marginBottom: '32px' }}>
        <div className="integrated-header">
          <div>
            <div className="integrated-title">Dedicated Portals for Every Stakeholder</div>
            <div className="integrated-subtitle">Select your account profile or navigate directly to your workspace</div>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            padding: '24px',
            gap: '24px',
          }}
        >
          {/* Student Pillar */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#fafafa',
            }}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-light)',
                  color: 'var(--brand-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <GraduationCap size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                Student Portal
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                Browse campus job openings, check minimum CGPA eligibility, submit applications with 1-click, and track live status updates from initial review to final offer letter.
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> Resume Upload & Profile Builder
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> 5-Stage Live Application Pipeline
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#10b981" /> Interview Schedule & Google Meet Links
                </li>
              </ul>
            </div>
            <button className="btn btn-primary" onClick={() => handleRoleEnter('student')}>
              Go to Student Dashboard
            </button>
          </div>

          {/* Recruiter Pillar */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#fafafa',
            }}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Building2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                Recruiter Portal
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                Post full-time and internship openings with branch filters, review applicant resumes, shortlist high-potential candidates, schedule interviews, and extend offers.
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> Post Job Vacancies & CTC Package
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> Filter Eligible Students by CGPA
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#10b981" /> Schedule Technical & HR Interviews
                </li>
              </ul>
            </div>
            <button
              className="btn btn-secondary"
              style={{ borderColor: 'var(--border-medium)' }}
              onClick={() => handleRoleEnter('recruiter')}
            >
              Go to Recruiter Dashboard
            </button>
          </div>

          {/* Admin Pillar */}
          <div
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#fafafa',
            }}
          >
            <div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: '#eff6ff',
                  color: '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>
                Placement Officer / Admin
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                Coordinate on-campus recruitment drives, verify hiring partners, audit student eligibility, monitor application volume across departments, and export reports.
              </p>
              <ul style={{ listStyle: 'none', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> On-Campus Placement Drives
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle size={14} color="#10b981" /> Campus-Wide Placement Analytics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={14} color="#10b981" /> Generate Official CTC Reports
                </li>
              </ul>
            </div>
            <button
              className="btn btn-secondary"
              style={{ borderColor: 'var(--border-medium)' }}
              onClick={() => handleRoleEnter('admin')}
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Placement Drives Preview */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Calendar size={18} /> Upcoming Campus Placement Drives
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('student-jobs')}
          >
            View All Openings <ArrowRight size={14} />
          </button>
        </div>
        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Drive Title</th>
                <th>Date & Venue</th>
                <th>Eligibility Criteria</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>Google India</td>
                <td>Google Mega Campus Recruitment 2026</td>
                <td>Oct 15, 2026 • Auditorium Hall A</td>
                <td>B.Tech (CSE, IT, ECE) • Min CGPA 7.5</td>
                <td>
                  <span className="badge badge-interview">Upcoming</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Microsoft</td>
                <td>Microsoft Sprint Hiring Wave</td>
                <td>Oct 22, 2026 • Seminar Complex Fl 3</td>
                <td>All B.Tech Departments • Min CGPA 7.5</td>
                <td>
                  <span className="badge badge-interview">Upcoming</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Amazon</td>
                <td>Amazon AWS FinTech & Cloud Drive</td>
                <td>Oct 29, 2026 • Virtual Coding Lab</td>
                <td>CSE, IT, ECE • Min CGPA 8.0</td>
                <td>
                  <span className="badge badge-interview">Upcoming</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
