import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { Job } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
} from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const { addToast } = useNotifications();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs();
      if (Array.isArray(data)) setJobs(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: Job) => {
    const nextStatus = job.status === 'Open' ? 'Closed' : 'Open';
    try {
      await api.updateJob(job.id, { status: nextStatus });
      addToast('Status Updated', `Job "${job.title}" marked as ${nextStatus}.`, 'success');
      fetchJobs();
    } catch (err: any) {
      addToast('Error', err.message || 'Could not update job status', 'warning');
    }
  };

  const handleDeleteJob = async (jobId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteJob(jobId);
      addToast('Job Removed', `Deleted job vacancy.`, 'info');
      fetchJobs();
    } catch (err: any) {
      addToast('Error', err.message || 'Could not delete job', 'warning');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(term) ||
      (j.company_name && j.company_name.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Campus Job Vacancy Control
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Audit, moderate, and monitor all campus job announcements and compensation offerings.
        </div>
      </div>

      <div
        className="integrated-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search jobs by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
          />
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Briefcase size={18} /> Master Job Catalog ({filteredJobs.length})
          </div>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Package / CTC</th>
                <th>Branches</th>
                <th>Cutoff</th>
                <th>Applications</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((j) => (
                <tr key={j.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{j.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {j.job_type} • {j.location}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{j.company_name}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{j.salary_package}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{j.department_eligibility}</td>
                  <td>{j.min_cgpa > 0 ? `${j.min_cgpa} CGPA` : 'Open'}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>
                      {j.applications_count || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${j.status === 'Open' ? 'badge-selected' : 'badge-applied'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleStatus(j)}
                      >
                        {j.status === 'Open' ? 'Close' : 'Reopen'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '4px 8px' }}
                        onClick={() => handleDeleteJob(j.id, j.title)}
                        title="Delete Vacancy"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
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
