import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { RecruiterStats, Job, Application } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Building,
  PlusCircle,
  Eye,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const RecruiterDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<RecruiterStats>({
    active_jobs: 2,
    total_applications: 14,
    shortlisted_candidates: 4,
    scheduled_interviews: 2,
    selected_candidates: 1,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsData, jobsData, appsData] = await Promise.all([
          api.getRecruiterStats().catch(() => null),
          api.getRecruiterJobs().catch(() => []),
          api.getRecruiterApplications().catch(() => []),
        ]);

        if (statsData) setStats(statsData);
        if (Array.isArray(jobsData)) setJobs(jobsData);
        if (Array.isArray(appsData)) setRecentApplicants(appsData.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      {/* Top Header */}
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
            Recruiter Workspace: {user?.company_name || 'Google India'}
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Recruiter: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.full_name}</span> •{' '}
            Verified Campus Partner: <span style={{ color: '#059669', fontWeight: 600 }}>Yes ✓</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('recruiter-eligible')}>
            <Users size={14} /> Scout Eligible Students
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('recruiter-post-job')}>
            <PlusCircle size={14} /> Post New Vacancy
          </button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="metric-strip">
        <div className="metric-item">
          <div className="metric-label">
            Active Job Postings <Briefcase size={15} color="#2563eb" />
          </div>
          <div className="metric-value">{stats.active_jobs}</div>
          <div className="metric-sub">Open for campus applications</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Total Applicants <Users size={15} color="#475569" />
          </div>
          <div className="metric-value">{stats.total_applications}</div>
          <div className="metric-sub">Resumes received</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Shortlisted <TrendingUp size={15} color="#059669" />
          </div>
          <div className="metric-value">{stats.shortlisted_candidates}</div>
          <div className="metric-sub">Cleared preliminary bar</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Interviews Set <Calendar size={15} color="#7c3aed" />
          </div>
          <div className="metric-value">{stats.scheduled_interviews}</div>
          <div className="metric-sub">Technical & HR rounds</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Selected / Hired <CheckCircle2 size={15} color="#10b981" />
          </div>
          <div className="metric-value">{stats.selected_candidates}</div>
          <div className="metric-sub">Campus offers released</div>
        </div>
      </div>

      {/* Active Vacancies Table */}
      <div className="integrated-panel" style={{ marginBottom: '24px' }}>
        <div className="integrated-header">
          <div>
            <div className="integrated-title">
              <Briefcase size={18} /> Company Job Postings ({jobs.length})
            </div>
            <div className="integrated-subtitle">
              Manage your live vacancy requirements and monitor application inflow
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('recruiter-post-job')}
          >
            <PlusCircle size={14} /> New Post
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No job postings created yet</div>
            <div className="empty-state-desc">
              Create your first campus vacancy to start receiving qualified student applications.
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('recruiter-post-job')}>
              Post a Job Opening
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Package / CTC</th>
                  <th>Eligible Branches</th>
                  <th>Cutoff CGPA</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{job.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {job.job_type} • {job.location}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>{job.salary_package}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{job.department_eligibility}</td>
                    <td style={{ fontWeight: 600 }}>{job.min_cgpa > 0 ? job.min_cgpa : 'Any'}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--brand-accent)',
                          background: 'var(--brand-light)',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {job.applications_count || 0} Applicants
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${job.status === 'Open' ? 'badge-selected' : 'badge-applied'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onNavigate('recruiter-applicants')}
                      >
                        <Users size={14} /> Manage Candidates
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Candidate Applications */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div>
            <div className="integrated-title">
              <Users size={18} /> Recent Candidate Pipeline
            </div>
            <div className="integrated-subtitle">
              Candidates applying across your open roles
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('recruiter-applicants')}
          >
            Open Full Pipeline <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Target Job</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplicants.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 700 }}>{app.student_name}</td>
                  <td>{app.student_roll}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{app.student_department}</td>
                  <td style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>
                    {app.student_cgpa}
                  </td>
                  <td>{app.job_title}</td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onNavigate('recruiter-applicants')}
                    >
                      Evaluate
                    </button>
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
