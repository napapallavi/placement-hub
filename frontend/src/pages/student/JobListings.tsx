import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../api/client';
import { Job } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
} from 'lucide-react';

export const JobListings: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Selected job for Details / Apply Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        search: search || undefined,
        department: departmentFilter !== 'All' ? departmentFilter : undefined,
        job_type: typeFilter !== 'All' ? typeFilter : undefined,
      });
      if (Array.isArray(data)) setJobs(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, departmentFilter, typeFilter]);

  const handleApply = async () => {
    if (!selectedJob) return;

    // Check CGPA eligibility
    const studentCgpa = user?.cgpa || 0;
    if (selectedJob.min_cgpa > studentCgpa) {
      addToast(
        'Ineligible for Job',
        `This job requires a minimum CGPA of ${selectedJob.min_cgpa}. Your CGPA is ${studentCgpa}.`,
        'warning'
      );
      return;
    }

    setApplying(true);
    try {
      await api.applyForJob(selectedJob.id, coverNote);
      addToast('Application Submitted!', `Successfully applied for ${selectedJob.title}.`, 'success');
      setSelectedJob(null);
      setCoverNote('');
      fetchJobs();
    } catch (err: any) {
      addToast('Application Error', err.message || 'Could not submit application', 'warning');
    } finally {
      setApplying(false);
    }
  };

  const isEligible = (job: Job) => {
    const studentCgpa = user?.cgpa || 0;
    return studentCgpa >= job.min_cgpa;
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Campus Job Vacancies
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Explore verified hiring openings across top campus recruiting partners.
        </div>
      </div>

      {/* Filter Toolbar */}
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
            placeholder="Search by job title, company, or location..."
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
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science & Eng.</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical">Mechanical Engineering</option>
          </select>
        </div>

        <div style={{ width: '160px' }}>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Integrated Table View of Jobs */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Briefcase size={18} /> Active Openings ({jobs.length})
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No matching job postings found</div>
            <div className="empty-state-desc">
              Try adjusting your search criteria or branch filters to discover more roles.
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Package / CTC</th>
                  <th>Eligible Branches</th>
                  <th>Min CGPA</th>
                  <th>Location</th>
                  <th>Eligibility & Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const eligible = isEligible(job);
                  return (
                    <tr key={job.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {job.job_type}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{job.company_name}</td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>{job.salary_package}</td>
                      <td style={{ fontSize: '0.8125rem' }}>{job.department_eligibility}</td>
                      <td>
                        {job.min_cgpa > 0 ? (
                          <span style={{ fontWeight: 600 }}>{job.min_cgpa}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {job.location}
                      </td>
                      <td>
                        {job.has_applied ? (
                          <StatusBadge status={job.application_status || 'Applied'} />
                        ) : eligible ? (
                          <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> Eligible
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={13} /> CGPA &lt; {job.min_cgpa}
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedJob(job)}
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Details & Apply Modal */}
      {selectedJob && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJob(null)}
          title={selectedJob.title}
          maxWidth="640px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>
                Close
              </button>
              {selectedJob.has_applied ? (
                <button className="btn btn-secondary" disabled>
                  Already Applied ({selectedJob.application_status})
                </button>
              ) : isEligible(selectedJob) ? (
                <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                  <Send size={15} /> {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              ) : (
                <button className="btn btn-secondary" disabled title="CGPA requirement not met">
                  Ineligible (Min CGPA: {selectedJob.min_cgpa})
                </button>
              )}
            </div>
          }
        >
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                background: 'var(--bg-surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Company</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedJob.company_name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CTC Package</div>
                <div style={{ fontWeight: 700, color: '#059669' }}>
                  {selectedJob.salary_package}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedJob.location}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '6px' }}>
                Job Description & Scope
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedJob.description}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '6px' }}>
                Eligibility Criteria
              </h4>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                • Eligible Departments: <strong>{selectedJob.department_eligibility}</strong>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                • Cutoff CGPA: <strong>{selectedJob.min_cgpa}</strong> (Your CGPA: {user?.cgpa || 0})
              </div>
            </div>

            {!selectedJob.has_applied && isEligible(selectedJob) && (
              <div className="form-group" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <label className="form-label">Cover Note / Remarks for Recruiter (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Share a short note on why you are interested in this position..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
