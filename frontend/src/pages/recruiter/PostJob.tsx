import React, { useState } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { PlusCircle, Briefcase, ArrowLeft } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const PostJob: React.FC<Props> = ({ onNavigate }) => {
  const { addToast } = useNotifications();

  const [form, setForm] = useState({
    title: '',
    job_type: 'Full-Time',
    salary_package: '',
    location: 'Bengaluru, India (Hybrid)',
    department_eligibility: 'Computer Science & Engineering, Information Technology',
    min_cgpa: 7.5,
    deadline: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.salary_package || !form.description) {
      setError('Please fill in Job Title, Salary Package, and Description.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await api.createJob({
        ...form,
        min_cgpa: parseFloat(form.min_cgpa as any) || 0,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      });
      addToast('Vacancy Published', `Job posting "${form.title}" is now open for students.`, 'success');
      onNavigate('recruiter-dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to publish job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '12px' }}
          onClick={() => onNavigate('recruiter-dashboard')}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Post New Campus Job Vacancy
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Publish an opening with eligibility cutoffs and role expectations.
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <PlusCircle size={18} /> Position Specifications
          </div>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger-text)',
              padding: '10px 14px',
              margin: '20px 24px 0 24px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
            }}
          >
            {error}
          </div>
        )}

        <form className="integrated-body" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Position Title *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Software Development Engineer (SDE-1)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="form-select"
                value={form.job_type}
                onChange={(e) => setForm({ ...form, job_type: e.target.value })}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract / Trainee</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Compensation / Package (CTC) *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. 24.5 LPA or 1.2 Lakhs / month"
                value={form.salary_package}
                onChange={(e) => setForm({ ...form, salary_package: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Location</label>
              <input
                type="text"
                className="form-input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department / Branch Eligibility</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CSE, IT, ECE or All"
                value={form.department_eligibility}
                onChange={(e) => setForm({ ...form, department_eligibility: e.target.value })}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Type specific branches or "All" for campus-wide eligibility.
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Minimum CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="form-input"
                value={form.min_cgpa}
                onChange={(e) => setForm({ ...form, min_cgpa: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Application Deadline Date</label>
            <input
              type="date"
              className="form-input"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Job Description & Requirements *</label>
            <textarea
              className="form-textarea"
              rows={5}
              required
              placeholder="Outline responsibilities, required skills, interview rounds, and qualifications..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate('recruiter-dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <PlusCircle size={16} /> {loading ? 'Publishing...' : 'Publish Vacancy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
