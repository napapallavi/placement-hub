import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerStudent: (data: any) => Promise<void>;
  registerRecruiter: (data: any) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('ph_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // invalid
        }
      } else {
        // Default to student demo user for instant demonstration
        const defaultDemoUser: User = {
          id: 1,
          email: 'student@college.edu',
          full_name: 'Aarav Patel',
          role: 'student',
          student_id: 1,
          roll_number: '22CS101',
          department: 'Computer Science & Engineering',
          cgpa: 9.12,
          resume_url: '/uploads/resumes/sample_resume.pdf',
        };
        setUser(defaultDemoUser);
        localStorage.setItem('ph_user', JSON.stringify(defaultDemoUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      localStorage.setItem('ph_user', JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const registerStudent = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerStudent(data);
      setUser(res.user);
      localStorage.setItem('ph_user', JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const registerRecruiter = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.registerRecruiter(data);
      setUser(res.user);
      localStorage.setItem('ph_user', JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('ph_user');
  };

  const quickSwitchRole = async (role: UserRole) => {
    let mockUser: User;
    if (role === 'student') {
      mockUser = {
        id: 1,
        email: 'student@college.edu',
        full_name: 'Aarav Patel',
        role: 'student',
        student_id: 1,
        roll_number: '22CS101',
        department: 'Computer Science & Engineering',
        cgpa: 9.12,
        resume_url: '/uploads/resumes/sample_resume.pdf',
      };
    } else if (role === 'recruiter') {
      mockUser = {
        id: 2,
        email: 'recruiter@google.com',
        full_name: 'Sarah Jenkins (Google India)',
        role: 'recruiter',
        company_id: 1,
        company_name: 'Google India',
        is_verified: true,
      };
    } else {
      mockUser = {
        id: 3,
        email: 'admin@college.edu',
        full_name: 'Dr. Ramesh Sharma (Placement Director)',
        role: 'admin',
      };
    }

    setUser(mockUser);
    localStorage.setItem('ph_user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerStudent,
        registerRecruiter,
        logout,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
