import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  Bell,
  CheckCheck,
  LogOut,
  User as UserIcon,
  Menu,
  ShieldAlert,
  Briefcase,
  Building2,
} from 'lucide-react';

interface Props {
  onToggleSidebar?: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<Props> = ({ onToggleSidebar, currentPage, onNavigate }) => {
  const { user, logout, quickSwitchRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    quickSwitchRole(role);
    if (role === 'student') onNavigate('student-dashboard');
    else if (role === 'recruiter') onNavigate('recruiter-dashboard');
    else onNavigate('admin-dashboard');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onToggleSidebar && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onToggleSidebar}
            style={{ display: 'inline-flex', padding: '6px' }}
            aria-label="Toggle Navigation"
          >
            <Menu size={18} />
          </button>
        )}
        <div
          className="navbar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => onNavigate('landing')}
        >
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <span>Placement Hub</span>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Quick Demo Role Switcher */}
        <div className="role-switcher-badge">
          <span style={{ padding: '0 6px', color: '#64748b', fontSize: '0.6875rem' }}>
            DEMO ROLE:
          </span>
          <button
            className={`role-switcher-btn ${user?.role === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('student')}
            title="Switch to Student view (Aarav Patel)"
          >
            Student
          </button>
          <button
            className={`role-switcher-btn ${user?.role === 'recruiter' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('recruiter')}
            title="Switch to Recruiter view (Google India)"
          >
            Recruiter
          </button>
          <button
            className={`role-switcher-btn ${user?.role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin')}
            title="Switch to Admin view (Placement Director)"
          >
            Admin
          </button>
        </div>

        {/* Notifications Bell */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="notif-bell-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge-count">{unreadCount}</span>}
          </button>

          {showNotifMenu && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Notifications ({notifications.length})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-accent)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.8125rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div>
                        <div className="notif-item-title">{n.title}</div>
                        <div className="notif-item-msg">{n.message}</div>
                        <div className="notif-item-time">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info & Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="user-menu-pill">
              <div className="avatar-circle">{getInitials(user.full_name)}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.full_name}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    textTransform: 'capitalize',
                    color: 'var(--brand-accent)',
                    fontWeight: 600,
                  }}
                >
                  {user.role} Portal
                </span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={logout}
              title="Logout"
              style={{ padding: '7px 10px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('login')}>
              Login
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('register-student')}>
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
