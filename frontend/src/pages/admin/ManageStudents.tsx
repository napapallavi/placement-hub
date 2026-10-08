import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { Student } from '../../types';
import { Modal } from '../../components/Modal';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  FileCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  FileSpreadsheet,
} from 'lucide-react';

export const ManageStudents: React.FC = () => {
  const { addToast } = useNotifications();

  const [students, setStudents] = useState<Student[]>([]);
  const [department, setDepartment] = useState('All');
  const [placedFilter, setPlacedFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit placement modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editPlaced, setEditPlaced] = useState(false);
  const [editCompany, setEditCompany] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStudents({
        department: department !== 'All' ? department : undefined,
        placed: placedFilter === 'placed' ? true : placedFilter === 'unplaced' ? false : undefined,
      });
      if (Array.isArray(data)) setStudents(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, placedFilter]);

  const filteredStudents = students.filter((s) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.full_name.toLowerCase().includes(term) ||
      s.roll_number.toLowerCase().includes(term) ||
      s.department.toLowerCase().includes(term)
    );
  });

  const handleUpdatePlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      await api.updateStudentPlacement(editingStudent.id, editPlaced, editCompany);
      addToast('Status Updated', `Placement record updated for ${editingStudent.full_name}.`, 'success');
      setEditingStudent(null);
      fetchStudents();
    } catch (err: any) {
      addToast('Error', err.message || 'Could not update status', 'warning');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Full Name', 'Department', 'CGPA', 'Placed', 'Company', 'Phone'];
    const rows = filteredStudents.map((s) => [
      s.roll_number,
      s.full_name,
      s.department,
      s.cgpa,
      s.is_placed ? 'Yes' : 'No',
      s.current_company || '',
      s.phone || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'placement_hub_students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Export Complete', 'Downloaded students master dataset as CSV.', 'success');
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
            Student Registry & Placements
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Central campus directory of registered candidates, academic standing, and placement records.
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
          <FileSpreadsheet size={15} /> Export Registry (CSV)
        </button>
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
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
          />
        </div>

        <div style={{ width: '240px' }}>
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Eng.</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>

        <div style={{ width: '180px' }}>
          <select
            className="form-select"
            value={placedFilter}
            onChange={(e) => setPlacedFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed Only</option>
            <option value="unplaced">Unplaced Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <GraduationCap size={18} /> Student Records ({filteredStudents.length})
          </div>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Placement Status</th>
                <th>Placed Company</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => (
                <tr key={st.id}>
                  <td style={{ fontWeight: 700 }}>{st.roll_number}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{st.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.email}</div>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{st.department}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>{st.cgpa}</span>
                  </td>
                  <td>
                    {st.is_placed ? (
                      <span className="badge badge-selected">
                        <CheckCircle2 size={12} /> Placed
                      </span>
                    ) : (
                      <span className="badge badge-applied">Seeking Placement</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {st.current_company || '—'}
                  </td>
                  <td>
                    <a
                      href={st.resume_url || '/uploads/resumes/sample_resume.pdf'}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px' }}
                    >
                      <Download size={12} /> View
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingStudent(st);
                        setEditPlaced(st.is_placed);
                        setEditCompany(st.current_company || '');
                      }}
                    >
                      <Edit2 size={13} /> Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit placement status modal */}
      {editingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setEditingStudent(null)}
          title={`Update Placement Status: ${editingStudent.full_name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleUpdatePlacement}>
            <div className="form-group">
              <label className="form-label">Placement Confirmation</label>
              <select
                className="form-select"
                value={editPlaced ? 'yes' : 'no'}
                onChange={(e) => setEditPlaced(e.target.value === 'yes')}
              >
                <option value="yes">Placed / Offer Accepted</option>
                <option value="no">Unplaced / Actively Seeking</option>
              </select>
            </div>

            {editPlaced && (
              <div className="form-group">
                <label className="form-label">Hiring Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  required={editPlaced}
                  placeholder="e.g. Google India, Microsoft, TCS..."
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
