import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Interview } from '../../types';
import {
  Calendar,
  Video,
  MapPin,
  Clock,
  Building2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const StudentInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await api.getMyInterviews();
        if (Array.isArray(data)) {
          setInterviews(data);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Interview Schedule
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Upcoming technical evaluations, coding rounds, and behavioral HR interviews.
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Calendar size={18} /> Scheduled Rounds ({interviews.length})
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No interviews scheduled yet</div>
            <div className="empty-state-desc">
              When recruiters shortlist your profile and invite you for an evaluation, it will appear here.
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Round Name</th>
                  <th>Company & Role</th>
                  <th>Date & Time</th>
                  <th>Mode</th>
                  <th>Meeting Link / Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.round_name}
                      </div>
                      {item.feedback && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Note: {item.feedback}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.company_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.job_title}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {new Date(item.interview_date).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(item.interview_date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-interview">
                        {item.interview_mode === 'Online' ? <Video size={12} /> : <MapPin size={12} />}
                        {item.interview_mode}
                      </span>
                    </td>
                    <td>
                      {item.meeting_link_or_venue.startsWith('http') ? (
                        <a
                          href={item.meeting_link_or_venue}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px' }}
                        >
                          Join Call <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8125rem' }}>{item.meeting_link_or_venue}</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-selected">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
