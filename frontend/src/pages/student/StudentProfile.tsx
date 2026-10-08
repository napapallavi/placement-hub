import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { api } from '../../api/client';
import { Student } from '../../types';
import {
  User,
  Upload,
  FileCheck,
  Download,
  Save,
  CheckCircle2,
  Building2,
  Award,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [profile, setProfile] = useState<Partial<Student>>({
    full_name: user?.full_name || 'Aarav Patel',
    email: user?.email || 'student@college.edu',
    roll_number: user?.roll_number || '22CS101',
    department: user?.department || 'Computer Science & Engineering',
    cgpa: user?.cgpa || 9.12,
    graduation_year: 2026,
    phone: '+91 98765 43210',
    skills: 'React, TypeScript, Python, FastAPI, Docker, PostgreSQL, Data Structures',
    bio: 'Final year CSE undergraduate enthusiastic about scalable systems and frontend engineering.',
    resume_url: user?.resume_url || '/uploads/resumes/sample_resume.pdf',
    is_placed: false,
    current_company: '',
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getStudentProfile();
        if (data) setProfile(data);
      } catch {
        // use default state
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateStudentProfile(profile);
      addToast('Profile Updated', 'Your student details were saved successfully.', 'success');
    } catch (err: any) {
      addToast('Update Failed', err.message || 'Could not save profile.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploading(true);
    try {
      const res = await api.uploadResume(file);
      setProfile((prev) => ({ ...prev, resume_url: res.resume_url }));
      addToast('Resume Uploaded', 'Your new resume is active for recruiters to view.', 'success');
    } catch (err: any) {
      addToast('Upload Failed', err.message || 'Failed to upload resume.', 'warning');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          My Student Profile & Resume
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Keep your academic credentials and verified resume updated for recruiter shortlisting.
        </div>
      </div>

      {profile.is_placed && (
        <div
          style={{
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Award size={24} color="#059669" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--success-text)' }}>
              Placement Secured!
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#065f46' }}>
              Congratulations! You are officially placed at{' '}
              <span style={{ fontWeight: 700 }}>{profile.current_company || 'Campus Partner'}</span>.
            </div>
          </div>
        </div>
      )}

      {/* Main Integrated Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Left Form Panel */}
        <div className="integrated-panel">
          <div className="integrated-header">
            <div className="integrated-title">
              <User size={18} /> Academic & Personal Details
            </div>
          </div>
          <form className="integrated-body" onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">College Roll Number (Fixed)</label>
                <input
                  type="text"
                  className="form-input"
                  disabled
                  style={{ background: '#f8fafc', color: '#64748b' }}
                  value={profile.roll_number || ''}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  disabled
                  style={{ background: '#f8fafc', color: '#64748b' }}
                  value={profile.email || ''}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Department / Branch</label>
                <select
                  className="form-select"
                  value={profile.department || ''}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                >
                  <option value="Computer Science & Engineering">Computer Science & Eng.</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  value={profile.cgpa || 0}
                  onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input
                  type="number"
                  className="form-input"
                  value={profile.graduation_year || 2026}
                  onChange={(e) =>
                    setProfile({ ...profile, graduation_year: parseInt(e.target.value, 10) || 2026 })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Skills & Frameworks</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, TypeScript, Python, FastAPI, Docker, SQL"
                value={profile.skills || ''}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Used by recruiters to match candidates for specialized technical roles.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary / Bio</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Briefly highlight your interests, project accomplishments, or career goals..."
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Resume Management Panel */}
        <div>
          <div className="integrated-panel">
            <div className="integrated-header">
              <div className="integrated-title">
                <Upload size={18} /> Official Resume
              </div>
            </div>
            <div className="integrated-body">
              <div
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  marginBottom: '16px',
                }}
              >
                <FileCheck size={36} color="var(--brand-accent)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '4px' }}>
                  {uploading ? 'Uploading resume...' : 'Upload Latest Resume'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Supported formats: PDF, DOCX (Max 10 MB)
                </div>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={handleResumeUpload}
                  />
                  Browse File
                </label>
              </div>

              {profile.resume_url && (
                <div
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <FileCheck size={18} color="#10b981" />
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {selectedFile ? selectedFile.name : 'Current_Resume.pdf'}
                    </span>
                  </div>
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px' }}
                    title="Download / View"
                  >
                    <Download size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
