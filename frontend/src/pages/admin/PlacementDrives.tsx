import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { PlacementDrive, Company } from '../../types';
import { Modal } from '../../components/Modal';
import {
  CalendarClock,
  PlusCircle,
  MapPin,
  Building2,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
} from 'lucide-react';

export const PlacementDrives: React.FC = () => {
  const { addToast } = useNotifications();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company_id: '',
    drive_date: '',
    venue: 'Auditorium Hall A & Online Coding Lab',
    eligibility_criteria: 'B.Tech (CSE, IT, ECE) with CGPA >= 7.5',
    description: '',
    status: 'Upcoming' as 'Upcoming' | 'Ongoing' | 'Completed',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [drivesData, companiesData] = await Promise.all([
        api.getPlacementDrives().catch(() => []),
        api.getAllCompanies().catch(() => []),
      ]);
      if (Array.isArray(drivesData)) setDrives(drivesData);
      if (Array.isArray(companiesData)) setCompanies(companiesData);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.drive_date || !form.venue) {
      addToast('Validation', 'Please fill in all mandatory fields.', 'warning');
      return;
    }

    try {
      await api.createPlacementDrive({
        ...form,
        company_id: form.company_id ? parseInt(form.company_id, 10) : undefined,
        drive_date: new Date(form.drive_date).toISOString(),
      });
      addToast('Drive Created', `Placement drive "${form.title}" added to calendar.`, 'success');
      setCreateModalOpen(false);
      setForm({
        title: '',
        company_id: '',
        drive_date: '',
        venue: 'Auditorium Hall A & Online Coding Lab',
        eligibility_criteria: 'B.Tech (CSE, IT, ECE) with CGPA >= 7.5',
        description: '',
        status: 'Upcoming',
      });
      fetchData();
    } catch (err: any) {
      addToast('Error', err.message || 'Could not create drive', 'warning');
    }
  };

  const handleDeleteDrive = async (id: number, title: string) => {
    if (!window.confirm(`Delete placement drive "${title}"?`)) return;
    try {
      await api.deletePlacementDrive(id);
      addToast('Drive Deleted', 'Removed drive from calendar.', 'info');
      fetchData();
    } catch (err: any) {
      addToast('Error', err.message || 'Could not delete drive', 'warning');
    }
  };

  return (
    <div>
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
            Campus Recruitment Drives
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Schedule and coordinate mega on-campus recruitment events and written assessments.
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setCreateModalOpen(true)}>
          <PlusCircle size={14} /> Schedule New Drive
        </button>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <CalendarClock size={18} /> Recruitment Drives ({drives.length})
          </div>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Drive Title</th>
                <th>Company Partner</th>
                <th>Date & Schedule</th>
                <th>Venue / Location</th>
                <th>Eligibility Criteria</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.title}</div>
                    {d.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {d.description}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{d.company_name || 'Multi-Company'}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {new Date(d.drive_date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{d.venue}</td>
                  <td style={{ fontSize: '0.8125rem', maxWidth: '200px' }}>
                    {d.eligibility_criteria}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        d.status === 'Completed'
                          ? 'badge-applied'
                          : d.status === 'Ongoing'
                          ? 'badge-selected'
                          : 'badge-interview'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '4px 8px' }}
                      onClick={() => handleDeleteDrive(d.id, d.title)}
                      title="Delete Drive"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Drive Modal */}
      {createModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCreateModalOpen(false)}
          title="Schedule Campus Placement Drive"
          maxWidth="600px"
        >
          <form onSubmit={handleCreateDrive}>
            <div className="form-group">
              <label className="form-label">Drive Title *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Google Mega Campus Recruitment 2026"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Recruiting Company</label>
                <select
                  className="form-select"
                  value={form.company_id}
                  onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                >
                  <option value="">Select Company (Optional)</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Scheduled Date *</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={form.drive_date}
                  onChange={(e) => setForm({ ...form, drive_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Venue / Lab *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch & CGPA Eligibility Criteria *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.eligibility_criteria}
                onChange={(e) => setForm({ ...form, eligibility_criteria: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Drive Overview / Agenda Notes</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Pre-placement talk at 9:00 AM followed by online coding test..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm & Publish Drive
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
