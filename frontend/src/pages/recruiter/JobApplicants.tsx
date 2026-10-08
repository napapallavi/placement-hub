import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { Application, Job, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Users,
  Filter,
  Eye,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  FileCheck,
  Star,
  Video,
} from 'lucide-react';

export const JobApplicants: React.FC = () => {
  const { addToast } = useNotifications();

  const [applicants, setApplicants] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Inspection modal
  const [activeApplicant, setActiveApplicant] = useState<Application | null>(null);

  // Schedule Interview modal state
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    round_name: 'Technical Round 1: Coding & Algorithms',
    interview_date: '',
    interview_mode: 'Online',
    meeting_link_or_venue: 'https://meet.google.com/xyz-interview-2026',
    feedback: 'Selected based on strong academic profile and problem solving.',
  });

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        api.getRecruiterJobs().catch(() => []),
        api.getRecruiterApplications(statusFilter !== 'all' ? statusFilter : undefined).catch(() => []),
      ]);
      if (Array.isArray(jobsData)) setJobs(jobsData);
      if (Array.isArray(appsData)) {
        let filtered = appsData;
        if (selectedJobId !== 'all') {
          filtered = filtered.filter((a) => a.job_id.toString() === selectedJobId);
        }
        setApplicants(filtered);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedJobId, statusFilter]);

  const handleUpdateStatus = async (appId: number, newStatus: ApplicationStatus, feedback?: string) => {
    try {
      await api.updateApplicationStatus(appId, newStatus, feedback);
      addToast('Status Updated', `Candidate moved to "${newStatus}".`, 'success');
      setActiveApplicant(null);
      fetchData();
    } catch (err: any) {
      addToast('Update Failed', err.message || 'Could not update status', 'warning');
    }
  };

  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplicant) return;

    try {
      await api.scheduleInterview({
        application_id: activeApplicant.id,
        round_name: interviewForm.round_name,
        interview_date: new Date(interviewForm.interview_date).toISOString(),
        interview_mode: interviewForm.interview_mode,
        meeting_link_or_venue: interviewForm.meeting_link_or_venue,
        feedback: interviewForm.feedback,
      });

      addToast(
        'Interview Scheduled',
        `Invitation sent to ${activeApplicant.student_name}. Status changed to "Interview Scheduled".`,
        'success'
      );
      setInterviewModalOpen(false);
      setActiveApplicant(null);
      fetchData();
    } catch (err: any) {
      addToast('Scheduling Failed', err.message || 'Could not schedule interview', 'warning');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Candidate Pipeline & Evaluation
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Evaluate applicant resumes, shortlist candidates, coordinate interview rounds, and make hiring offers.
        </div>
      </div>

      {/* Filter toolbar */}
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
        <div style={{ width: '260px' }}>
          <label className="form-label" style={{ marginBottom: '4px' }}>Filter by Job Post</label>
          <select
            className="form-select"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="all">All Jobs ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id.toString()}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: '220px' }}>
          <label className="form-label" style={{ marginBottom: '4px' }}>Pipeline Status</label>
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
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Users size={18} /> Candidate Applications ({applicants.length})
          </div>
        </div>

        {applicants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No applicants matching this filter</div>
            <div className="empty-state-desc">
              Try selecting a different job vacancy or reset status filters.
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Roll & Branch</th>
                  <th>CGPA</th>
                  <th>Job Applied</th>
                  <th>Key Skills</th>
                  <th>Current Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {app.student_name}
                      </div>
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
                      <span
                        style={{
                          fontWeight: 800,
                          color: (app.student_cgpa || 0) >= 8.5 ? '#059669' : 'var(--brand-accent)',
                        }}
                      >
                        {app.student_cgpa}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{app.job_title}</td>
                    <td style={{ fontSize: '0.75rem', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.student_skills || 'General'}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setActiveApplicant(app)}
                        >
                          <Eye size={13} /> Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Evaluation Modal */}
      {activeApplicant && (
        <Modal
          isOpen={true}
          onClose={() => setActiveApplicant(null)}
          title={`Evaluating Candidate: ${activeApplicant.student_name}`}
          maxWidth="700px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setRejectModalOpen(true)}
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {activeApplicant.status === 'Applied' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleUpdateStatus(activeApplicant.id, 'Under Review')}
                  >
                    Mark Under Review
                  </button>
                )}

                {activeApplicant.status !== 'Shortlisted' && activeApplicant.status !== 'Selected' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleUpdateStatus(activeApplicant.id, 'Shortlisted')}
                  >
                    <Star size={14} color="#f59e0b" /> Shortlist
                  </button>
                )}

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const defaultDate = new Date(Date.now() + 86400000 * 2);
                    defaultDate.setHours(14, 0, 0, 0);
                    setInterviewForm({
                      ...interviewForm,
                      interview_date: defaultDate.toISOString().slice(0, 16),
                    });
                    setInterviewModalOpen(true);
                  }}
                >
                  <Calendar size={14} /> Schedule Interview
                </button>

                {activeApplicant.status !== 'Selected' && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: '#059669', borderColor: '#059669' }}
                    onClick={() => handleUpdateStatus(activeApplicant.id, 'Selected')}
                  >
                    <CheckCircle2 size={14} /> Select & Offer
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                background: 'var(--bg-surface-subtle)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll Number</div>
                <div style={{ fontWeight: 700 }}>{activeApplicant.student_roll}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Branch</div>
                <div style={{ fontWeight: 700 }}>{activeApplicant.student_department}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CGPA</div>
                <div style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>
                  {activeApplicant.student_cgpa}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applied Role</div>
                <div style={{ fontWeight: 700 }}>{activeApplicant.job_title}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '4px' }}>
                Technical Skills & Competencies
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {activeApplicant.student_skills || 'Not specified'}
              </p>
            </div>

            {activeApplicant.cover_note && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '4px' }}>
                  Candidate's Application Statement
                </h4>
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontStyle: 'italic',
                    color: 'var(--text-secondary)',
                  }}
                >
                  "{activeApplicant.cover_note}"
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px' }}>
                Attached Candidate Resume
              </h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck size={18} color="#10b981" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {activeApplicant.student_name}_Verified_Resume.pdf
                  </span>
                </div>
                <a
                  href={activeApplicant.resume_url || '/uploads/resumes/sample_resume.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={14} /> View / Download Resume
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setInterviewModalOpen(false)}
          title={`Schedule Interview Round: ${activeApplicant?.student_name}`}
          maxWidth="600px"
        >
          <form onSubmit={handleScheduleInterviewSubmit}>
            <div className="form-group">
              <label className="form-label">Interview Round Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={interviewForm.round_name}
                onChange={(e) => setInterviewForm({ ...interviewForm, round_name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Date and Time *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  required
                  value={interviewForm.interview_date}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interview_date: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Interview Mode</label>
                <select
                  className="form-select"
                  value={interviewForm.interview_mode}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interview_mode: e.target.value })
                  }
                >
                  <option value="Online">Online Video Call</option>
                  <option value="In-Person">In-Person Campus Venue</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Google Meet Link or Venue Details *</label>
              <input
                type="text"
                className="form-input"
                required
                value={interviewForm.meeting_link_or_venue}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, meeting_link_or_venue: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preparation Instructions for Candidate</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={interviewForm.feedback}
                onChange={(e) => setInterviewForm({ ...interviewForm, feedback: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setInterviewModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm & Send Invite
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && activeApplicant && (
        <Modal
          isOpen={true}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Candidate"
          maxWidth="500px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
              <button className="btn btn-secondary" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleUpdateStatus(activeApplicant.id, 'Rejected', rejectReason);
                  setRejectModalOpen(false);
                }}
              >
                Confirm Rejection
              </button>
            </div>
          }
        >
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Are you sure you want to reject {activeApplicant.student_name} for the position of{' '}
              {activeApplicant.job_title}? The student will receive an update in their portal.
            </p>
            <div className="form-group">
              <label className="form-label">Optional Feedback for Candidate</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Profile did not match current technical prerequisite..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
