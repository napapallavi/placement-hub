import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Student } from '../../types';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Download,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export const EligibleStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [department, setDepartment] = useState('All');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getEligibleStudents({
        department: department !== 'All' ? department : undefined,
        min_cgpa: minCgpa > 0 ? minCgpa : undefined,
        skill: skill || undefined,
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
  }, [department, minCgpa, skill]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Campus Talent Directory
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Explore eligible student candidates filtered by minimum CGPA, branch, and core competencies.
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
        <div style={{ width: '240px' }}>
          <label className="form-label" style={{ marginBottom: '4px' }}>Department / Branch</label>
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

        <div style={{ width: '160px' }}>
          <label className="form-label" style={{ marginBottom: '4px' }}>Minimum CGPA Cutoff</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            className="form-input"
            value={minCgpa}
            onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label className="form-label" style={{ marginBottom: '4px' }}>Filter by Specific Skill</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="e.g. React, Python, Cloud, Java..."
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <GraduationCap size={18} /> Qualified Candidates ({students.length})
          </div>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No students meet the specified criteria</div>
            <div className="empty-state-desc">
              Try adjusting the CGPA cutoff or searching for different skill sets.
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Skills & Tech Stack</th>
                  <th>Placement Status</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {st.full_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {st.email}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{st.roll_number}</td>
                    <td style={{ fontSize: '0.8125rem' }}>{st.department}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          color: st.cgpa >= 8.5 ? '#059669' : 'var(--brand-accent)',
                        }}
                      >
                        {st.cgpa}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', maxWidth: '280px' }}>
                      {st.skills || 'Not specified'}
                    </td>
                    <td>
                      {st.is_placed ? (
                        <span className="badge badge-selected">
                          Placed ({st.current_company || 'Campus'})
                        </span>
                      ) : (
                        <span className="badge badge-applied">Available</span>
                      )}
                    </td>
                    <td>
                      <a
                        href={st.resume_url || '/uploads/resumes/sample_resume.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        <Download size={13} /> Resume
                      </a>
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
