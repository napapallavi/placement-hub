import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'alert') => void;
  toast: { title: string; message: string; type: string } | null;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ title: string; message: string; type: string } | null>(null);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications();
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      } else {
        // Sample default notifications according to role
        if (user.role === 'student') {
          setNotifications([
            {
              id: 1,
              title: 'Interview Scheduled with Google!',
              message: 'Your Technical Round 1 for SDE-1 has been scheduled for Oct 10, 2026.',
              is_read: false,
              type: 'interview',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              title: 'Shortlisted for Microsoft Azure',
              message: 'Congratulations! Your profile has been shortlisted.',
              is_read: false,
              type: 'success',
              created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            },
          ]);
        } else if (user.role === 'recruiter') {
          setNotifications([
            {
              id: 10,
              title: 'New Candidate Applied',
              message: 'Aarav Patel applied for SDE-1 role.',
              is_read: false,
              type: 'info',
              created_at: new Date().toISOString(),
            },
          ]);
        } else {
          setNotifications([
            {
              id: 20,
              title: 'Google Campus Drive Confirmed',
              message: 'Campus recruitment drive scheduled for next week.',
              is_read: false,
              type: 'info',
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const markAsRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
    } catch {
      // offline fallback
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
    } catch {
      // offline fallback
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addToast,
        toast,
        refreshNotifications: fetchNotifs,
      }}
    >
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: toast.type === 'success' ? '#065f46' : toast.type === 'warning' ? '#92400e' : '#1e3a8a',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            zIndex: 9999,
            maxWidth: '380px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ fontWeight: '700', fontSize: '0.875rem', marginBottom: '2px' }}>{toast.title}</div>
          <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>{toast.message}</div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
