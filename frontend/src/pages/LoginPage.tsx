import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { GraduationCap, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login, quickSwitchRole } = useAuth();
  const { addToast } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      addToast('Welcome back!', 'Logged in successfully.', 'success');
      if (email.includes('admin')) onNavigate('admin-dashboard');
      else if (email.includes('recruiter') || email.includes('google')) onNavigate('recruiter-dashboard');
      else onNavigate('student-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'student' | 'recruiter' | 'admin') => {
    quickSwitchRole(role);
    addToast('Demo Access', `Logged in as demo ${role}.`, 'info');
    if (role === 'student') onNavigate('student-dashboard');
    else if (role === 'recruiter') onNavigate('recruiter-dashboard');
    else onNavigate('admin-dashboard');
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '40px auto',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        boxShadow: 'var(--shadow-dropdown)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}
        >
          <GraduationCap size={28} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Sign In to Placement Hub
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Enter your institutional credentials to access your portal
        </p>
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

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="e.g. student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail
              size={16}
              style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Lock
              size={16}
              style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '11px' }}
          disabled={loading}
        >
          <LogIn size={16} /> {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* Demo Credentials Section */}
      <div style={{ margin: '24px 0 16px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          Instant Demo Logins (No password needed)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDemoLogin('student')}
            title="Login as Aarav Patel (Student)"
          >
            Student
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDemoLogin('recruiter')}
            title="Login as Google India (Recruiter)"
          >
            Recruiter
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleDemoLogin('admin')}
            title="Login as Placement Director (Admin)"
          >
            Admin
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '20px' }}>
        Don't have an account yet?{' '}
        <span
          style={{ color: 'var(--brand-accent)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => onNavigate('register-student')}
        >
          Register as Student
        </span>{' '}
        or{' '}
        <span
          style={{ color: 'var(--brand-accent)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => onNavigate('register-recruiter')}
        >
          Company
        </span>
      </div>
    </div>
  );
};
