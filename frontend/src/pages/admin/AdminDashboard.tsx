import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AdminStats } from '../../types';
import {
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  CalendarClock,
  BarChart3,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats>({
    total_students: 120,
    placed_students: 94,
    placement_rate: 78.3,
    total_companies: 24,
    total_jobs: 38,
    total_applications: 245,
    highest_package: '44.0 LPA',
    average_package: '12.8 LPA',
    department_stats: [
      { department: 'Computer Science & Engineering', total: 60, placed: 52, percentage: 86.6 },
      { department: 'Information Technology', total: 30, placed: 24, percentage: 80.0 },
      { department: 'Electronics & Communication', total: 20, placed: 13, percentage: 65.0 },
      { department: 'Mechanical Engineering', total: 10, placed: 5, percentage: 50.0 },
    ],
    status_distribution: {
      Applied: 45,
      'Under Review': 30,
      Shortlisted: 25,
      'Interview Scheduled': 18,
      Selected: 94,
      Rejected: 33,
    },
    recent_placements: [
      {
        id: 1,
        student_name: 'Priya Sharma',
        roll_number: '22IT104',
        department: 'Information Technology',
        company_name: 'Microsoft',
        package: '28.0 LPA',
        date: '2026-10-06',
      },
      {
        id: 2,
        student_name: 'Ananya Singh',
        roll_number: '22CS142',
        department: 'Computer Science & Engineering',
        company_name: 'Google India',
        package: '32.5 LPA',
        date: '2026-10-05',
      },
      {
        id: 3,
        student_name: 'Rohan Mehra',
        roll_number: '22CS118',
        department: 'Computer Science & Engineering',
        company_name: 'Amazon',
        package: '30.0 LPA',
        date: '2026-10-03',
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        if (data) setStats(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Top Header */}
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
            Placement Directorate Executive Overview
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Campus recruitment performance, department milestones, and drive coordination.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('admin-drives')}>
            <CalendarClock size={14} /> Placement Drives
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('admin-reports')}>
            <BarChart3 size={14} /> Official Reports
          </button>
        </div>
      </div>

      {/* Main Metric Strip */}
      <div className="metric-strip">
        <div className="metric-item">
          <div className="metric-label">
            Placement Rate <TrendingUp size={15} color="#10b981" />
          </div>
          <div className="metric-value">{stats.placement_rate}%</div>
          <div className="metric-sub">{stats.placed_students} of {stats.total_students} Placed</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Highest Package <Award size={15} color="#f59e0b" />
          </div>
          <div className="metric-value">{stats.highest_package}</div>
          <div className="metric-sub">Amazon Applied Scientist</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Average Package <Briefcase size={15} color="#2563eb" />
          </div>
          <div className="metric-value">{stats.average_package}</div>
          <div className="metric-sub">Across all engineering branches</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Companies Joined <Building2 size={15} color="#7c3aed" />
          </div>
          <div className="metric-value">{stats.total_companies}</div>
          <div className="metric-sub">Hiring organizations registered</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Active Vacancies <Layers size={15} color="#059669" />
          </div>
          <div className="metric-value">{stats.total_jobs}</div>
          <div className="metric-sub">{stats.total_applications} Student applications</div>
        </div>
      </div>

      {/* Integrated Department-wise Placement Analysis */}
      <div className="integrated-panel" style={{ marginBottom: '24px' }}>
        <div className="integrated-header">
          <div>
            <div className="integrated-title">
              <BarChart3 size={18} /> Department-Wise Placement Performance
            </div>
            <div className="integrated-subtitle">
              Comparison of placed students vs branch batch sizes
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('admin-students')}
          >
            Manage Students <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Students</th>
                <th>Placed Count</th>
                <th>Placement Progress</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stats.department_stats.map((dept) => (
                <tr key={dept.department}>
                  <td style={{ fontWeight: 700 }}>{dept.department}</td>
                  <td>{dept.total}</td>
                  <td style={{ fontWeight: 600, color: '#059669' }}>{dept.placed}</td>
                  <td style={{ width: '35%' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '10px',
                        background: '#e2e8f0',
                        borderRadius: '999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${dept.percentage}%`,
                          height: '100%',
                          background:
                            dept.percentage >= 80 ? '#10b981' : dept.percentage >= 60 ? '#3b82f6' : '#f59e0b',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {dept.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Placement Offers */}
      <div className="integrated-panel">
        <div className="integrated-header">
          <div>
            <div className="integrated-title">
              <CheckCircle2 size={18} /> Recent Verified Campus Placements
            </div>
            <div className="integrated-subtitle">
              Offers confirmed by recruiters for the current batch
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('admin-reports')}
          >
            Full Reports <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Hiring Company</th>
                <th>Package Offered</th>
                <th>Offer Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_placements.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700 }}>{p.student_name}</td>
                  <td>{p.roll_number}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{p.department}</td>
                  <td style={{ fontWeight: 600 }}>{p.company_name}</td>
                  <td style={{ fontWeight: 800, color: '#059669' }}>{p.package}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
