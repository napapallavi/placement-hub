import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Application } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Layers,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  FileCheck,
} from 'lucide-react';

export const AllApplicationsMonitor: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getAllApplications(statusFilter !== 'all' ? statusFilter : undefined);
      if (Array.isArray(data)) setApplications(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const filtered = applications.filter((app) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (app.student_name && app.student_name.toLowerCase().includes(term)) ||
      (app.company_name && app.company_name.toLowerCase().includes(term)) ||
      (app.job_title && app.job_title.toLowerCase().includes(term)) ||
      (app.student_roll && app.student_roll.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Campus Applications Monitor
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Real-time institutional oversight across student applications and hiring pipeline stages.
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
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search by student, company, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
          />
        </div>

        <div style={{ width: '220px' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected / Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Layers size={18} /> Central Application Log ({filtered.length})
          </div>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll & Branch</th>
                <th>CGPA</th>
                <th>Target Company & Role</th>
                <th>CTC Package</th>
                <th>Applied Date</th>
                <th>Pipeline Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{app.student_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.student_email}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.student_roll}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.student_department}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>
                      {app.student_cgpa}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.company_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.job_title}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{app.salary_package}</td>
                  <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge status={app.status} />
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
