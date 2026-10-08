import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { GraduationCap, Building2, UserPlus } from 'lucide-react';

interface Props {
  initialType?: 'student' | 'recruiter';
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ initialType = 'student', onNavigate }) => {
  const { registerStudent, registerRecruiter } = useAuth();
  const { addToast } = useNotifications();

  const [regType, setRegType] = useState<'student' | 'recruiter'>(initialType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    email: '',
    password: '',
    roll_number: '',
    department: 'Computer Science & Engineering',
    cgpa: 8.5,
    graduation_year: 2026,
    phone: '',
    skills: 'React, Python, SQL',
  });

  // Recruiter form state
  const [recruiterForm, setRecruiterForm] = useState({
    full_name: '',
    email: '',
    password: '',
    company_name: '',
    industry: 'Technology & Software',
    website: 'https://',
    location: 'Bengaluru, India',
    contact_email: '',
    description: '',
  });

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.full_name || !studentForm.email || !studentForm.password || !studentForm.roll_number) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await registerStudent({
        ...studentForm,
        cgpa: parseFloat(studentForm.cgpa as any),
        graduation_year: parseInt(studentForm.graduation_year as any, 10),
      });
      addToast('Registration Successful', 'Welcome to Placement Hub!', 'success');
      onNavigate('student-dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterForm.full_name || !recruiterForm.email || !recruiterForm.password || !recruiterForm.company_name) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await registerRecruiter({
        ...recruiterForm,
        contact_email: recruiterForm.contact_email || recruiterForm.email,
      });
      addToast('Company Registered', 'Recruiter account activated successfully!', 'success');
      onNavigate('recruiter-dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '30px auto',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        boxShadow: 'var(--shadow-dropdown)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Create an Account
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Join Placement Hub as a student candidate or an enterprise hiring partner
        </p>

        {/* Tab switch */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginTop: '16px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${regType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => setRegType('student')}
          >
            <GraduationCap size={15} /> Student Registration
          </button>
          <button
            type="button"
            className={`btn btn-sm ${regType === 'recruiter' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
            onClick={() => setRegType('recruiter')}
          >
            <Building2 size={15} /> Recruiter Registration
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {regType === 'student' ? (
        <form onSubmit={handleStudentSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Aarav Patel"
                value={studentForm.full_name}
                onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">College Roll Number *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. 22CS101"
                value={studentForm.roll_number}
                onChange={(e) => setStudentForm({ ...studentForm, roll_number: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="student@college.edu"
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="Min 6 characters"
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="form-select"
                value={studentForm.department}
                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
              >
                <option value="Computer Science & Engineering">Computer Science & Eng.</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">CGPA *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-input"
                required
                value={studentForm.cgpa}
                onChange={(e) => setStudentForm({ ...studentForm, cgpa: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Passout Year</label>
              <input
                type="number"
                className="form-input"
                value={studentForm.graduation_year}
                onChange={(e) => setStudentForm({ ...studentForm, graduation_year: parseInt(e.target.value, 10) || 2026 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={studentForm.phone}
              onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Skills (Comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="React, TypeScript, Python, SQL, Docker"
              value={studentForm.skills}
              onChange={(e) => setStudentForm({ ...studentForm, skills: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
            disabled={loading}
          >
            <UserPlus size={16} /> {loading ? 'Registering...' : 'Register as Student'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRecruiterSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">HR / Recruiter Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Sarah Jenkins"
                value={recruiterForm.full_name}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, full_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Google India"
                value={recruiterForm.company_name}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, company_name: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Corporate Email *</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="recruiter@company.com"
                value={recruiterForm.email}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="Min 6 characters"
                value={recruiterForm.password}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Industry Sector *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Cloud & Software"
                value={recruiterForm.industry}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, industry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Office Location *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Bengaluru, India"
                value={recruiterForm.location}
                onChange={(e) => setRecruiterForm({ ...recruiterForm, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Website</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://company.com"
              value={recruiterForm.website}
              onChange={(e) => setRecruiterForm({ ...recruiterForm, website: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
            disabled={loading}
          >
            <Building2 size={16} /> {loading ? 'Registering...' : 'Register as Recruiter'}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '20px' }}>
        Already have an account?{' '}
        <span
          style={{ color: 'var(--brand-accent)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => onNavigate('login')}
        >
          Sign In
        </span>
      </div>
    </div>
  );
};
