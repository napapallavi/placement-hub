import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { StudentStats, Application, Job, Interview } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Briefcase,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Video,
  Upload,
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const StudentDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    applied_count: 3,
    under_review_count: 1,
    shortlisted_count: 1,
    interviews_count: 1,
    offers_count: 0,
    profile_completion: 85,
  });
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, appsData, jobsData, interviewsData] = await Promise.all([
          api.getStudentStats().catch(() => null),
          api.getStudentApplications().catch(() => []),
          api.getJobs({ status: 'Open' }).catch(() => []),
          api.getMyInterviews().catch(() => []),
        ]);

        if (statsData) setStats(statsData);
        if (Array.isArray(appsData)) setRecentApps(appsData.slice(0, 5));
        if (Array.isArray(jobsData)) setRecommendedJobs(jobsData.slice(0, 3));
        if (Array.isArray(interviewsData)) setUpcomingInterviews(interviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div>
      {/* Top Welcome Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome back, {user?.full_name || 'Student'}!
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Roll No: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.roll_number || '22CS101'}</span> •{' '}
            Department: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.department || 'Computer Science'}</span> •{' '}
            CGPA: <span style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>{user?.cgpa || '9.12'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('student-profile')}>
            <Upload size={14} /> Profile & Resume
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('student-jobs')}>
            <Briefcase size={14} /> Explore Jobs
          </button>
        </div>
      </div>

      {/* Profile Completion Alert Banner if < 100% */}
      {stats.profile_completion < 100 && (
        <div
          style={{
            background: 'var(--brand-light)',
            border: '1px solid var(--brand-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.875rem' }}>
              Profile Strength: {stats.profile_completion}%
            </div>
            <div
              style={{
                width: '120px',
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${stats.profile_completion}%`,
                  height: '100%',
                  background: 'var(--brand-accent)',
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Complete your skills and upload your latest resume to boost recruiter shortlists.
            </span>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('student-profile')}
          >
            Update Profile
          </button>
        </div>
      )}

      {/* Integrated Metrics Strip */}
      <div className="metric-strip">
        <div className="metric-item">
          <div className="metric-label">
            Total Applied <Briefcase size={15} color="#2563eb" />
          </div>
          <div className="metric-value">{stats.applied_count}</div>
          <div className="metric-sub">Active job applications</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Under Review <Clock size={15} color="#d97706" />
          </div>
          <div className="metric-value">{stats.under_review_count}</div>
          <div className="metric-sub">HR evaluating resume</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Shortlisted <TrendingUp size={15} color="#059669" />
          </div>
          <div className="metric-value">{stats.shortlisted_count}</div>
          <div className="metric-sub">Passed initial screening</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Interviews <Calendar size={15} color="#7c3aed" />
          </div>
          <div className="metric-value">{stats.interviews_count}</div>
          <div className="metric-sub">Scheduled rounds</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Offers Issued <CheckCircle2 size={15} color="#10b981" />
          </div>
          <div className="metric-value">{stats.offers_count}</div>
          <div className="metric-sub">Final campus offers</div>
        </div>
      </div>

      {/* Upcoming Interview Alert Box */}
      {upcomingInterviews.length > 0 && (
        <div
          style={{
            background: 'var(--interview-bg)',
            border: '1px solid var(--interview-border)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#8b5cf6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Video size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--interview-text)', fontSize: '0.9375rem' }}>
                Upcoming Interview: {upcomingInterviews[0].round_name}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {upcomingInterviews[0].company_name || 'Hiring Partner'} • Date:{' '}
                {new Date(upcomingInterviews[0].interview_date).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                ({upcomingInterviews[0].interview_mode})
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {upcomingInterviews[0].meeting_link_or_venue.startsWith('http') && (
              <a
                href={upcomingInterviews[0].meeting_link_or_venue}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
              >
                Join Meeting Link <Video size={14} />
              </a>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('student-interviews')}
            >
              View Schedule
            </button>
          </div>
        </div>
      )}

      {/* Recent Applications Pipeline Panel */}
      <div className="integrated-panel" style={{ marginBottom: '24px' }}>
        <div className="integrated-header">
          <div>
            <div className="integrated-title">
              <FileText size={18} /> My Application Tracker
            </div>
            <div className="integrated-subtitle">
              Live status progression across Applied → Under Review → Shortlisted → Interview Scheduled → Selected
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('student-applications')}
          >
            View All ({recentApps.length}) <ArrowRight size={14} />
          </button>
        </div>

        {recentApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No applications submitted yet</div>
            <div className="empty-state-desc">
              Browse the campus job openings catalog and apply to your preferred companies.
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('student-jobs')}>
              Browse Open Jobs
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Package / CTC</th>
                  <th>Applied On</th>
                  <th>Application Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.job_title}</td>
                    <td>{app.company_name}</td>
                    <td style={{ fontWeight: 600, color: 'var(--brand-accent)' }}>
                      {app.salary_package}
                    </td>
                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onNavigate('student-applications')}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div>
            <div className="integrated-title">
              <Building2 size={18} /> Recommended Opportunities
            </div>
            <div className="integrated-subtitle">
              Openings matched with your branch eligibility and CGPA requirements
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('student-jobs')}
          >
            Explore All Jobs <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Company & Location</th>
                <th>Package</th>
                <th>Min CGPA</th>
                <th>Eligibility</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recommendedJobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td>
                    {job.company_name} • <span style={{ color: 'var(--text-muted)' }}>{job.location}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{job.salary_package}</td>
                  <td>{job.min_cgpa > 0 ? `${job.min_cgpa} CGPA` : 'Open for all'}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{job.department_eligibility}</td>
                  <td>
                    {job.has_applied ? (
                      <span className="badge badge-applied">Applied</span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onNavigate('student-jobs')}
                      >
                        View & Apply
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
