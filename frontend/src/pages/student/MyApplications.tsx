import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Application } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { ApplicationFlowStepper } from '../../components/ApplicationFlowStepper';
import { Modal } from '../../components/Modal';
import {
  FileText,
  Building2,
  Calendar,
  Video,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.getStudentApplications();
        if (Array.isArray(data)) {
          setApplications(data);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          My Applications
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Track recruitment pipeline progress from submission to offer acceptance.
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <FileText size={18} /> Application History ({applications.length})
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No applications found</div>
            <div className="empty-state-desc">
              You haven't applied to any job vacancies yet. Head over to the jobs tab to apply.
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>CTC Package</th>
                  <th>Date Applied</th>
                  <th>Current Pipeline Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.job_title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.company_location}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{app.company_name}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>{app.salary_package}</td>
                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye size={14} /> Pipeline View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail & Flow Stepper Modal */}
      {selectedApp && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.job_title}`}
          maxWidth="680px"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>
              Close
            </button>
          }
        >
          <div>
            {/* 5-Step Pipeline Flow */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}
              >
                Hiring Pipeline Progress
              </div>
              <ApplicationFlowStepper currentStatus={selectedApp.status} />
            </div>

            {/* Overview info box */}
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
                <div style={{ fontWeight: 700 }}>{selectedApp.company_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offered Package</div>
                <div style={{ fontWeight: 700, color: '#059669' }}>{selectedApp.salary_package}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Status</div>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>

            {/* Interviews if scheduled */}
            {selectedApp.interviews && selectedApp.interviews.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '10px' }}>
                  Scheduled Interview Rounds
                </h4>
                {selectedApp.interviews.map((interview) => (
                  <div
                    key={interview.id}
                    style={{
                      background: 'var(--interview-bg)',
                      border: '1px solid var(--interview-border)',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, color: 'var(--interview-text)', fontSize: '0.875rem' }}>
                        {interview.round_name}
                      </div>
                      <span className="badge badge-interview">{interview.interview_mode}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Date: {new Date(interview.interview_date).toLocaleString()}
                    </div>
                    {interview.meeting_link_or_venue && (
                      <div style={{ fontSize: '0.8125rem', marginTop: '6px' }}>
                        <strong>Link / Venue: </strong>
                        {interview.meeting_link_or_venue.startsWith('http') ? (
                          <a
                            href={interview.meeting_link_or_venue}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--brand-accent)', textDecoration: 'underline' }}
                          >
                            {interview.meeting_link_or_venue}
                          </a>
                        ) : (
                          interview.meeting_link_or_venue
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Cover note */}
            {selectedApp.cover_note && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Your Submitted Note
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{selectedApp.cover_note}"
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
