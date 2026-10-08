import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { PlacementReportData } from '../../types';
import { useNotifications } from '../../context/NotificationContext';
import {
  BarChart3,
  Award,
  TrendingUp,
  Building2,
  Printer,
  Download,
  Calendar,
  FileText,
} from 'lucide-react';

export const PlacementReports: React.FC = () => {
  const { addToast } = useNotifications();

  const [report, setReport] = useState<PlacementReportData>({
    academic_year: '2025-2026',
    generated_at: '2026-10-08',
    total_eligible_students: 120,
    total_offers_made: 109,
    highest_ctc: '44.0 LPA',
    median_ctc: '11.2 LPA',
    average_ctc: '12.8 LPA',
    companies_participated: 24,
    salary_brackets: {
      'Above 20 LPA': 14,
      '12 - 20 LPA': 26,
      '8 - 12 LPA': 38,
      '4 - 8 LPA': 24,
      '< 4 LPA': 7,
    },
    top_recruiters: [
      { name: 'Amazon', hires: 14 },
      { name: 'Google India', hires: 9 },
      { name: 'Microsoft', hires: 8 },
      { name: 'Deloitte', hires: 18 },
      { name: 'TCS Digital', hires: 22 },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getPlacementReports();
        if (data) setReport(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrintReport = () => {
    window.print();
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
            Annual Campus Placement Report
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Academic Session {report.academic_year} • Generated on {report.generated_at}
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handlePrintReport}>
          <Printer size={15} /> Print / Export Official Report
        </button>
      </div>

      {/* Highlights Strip */}
      <div className="metric-strip">
        <div className="metric-item">
          <div className="metric-label">
            Highest CTC <Award size={15} color="#f59e0b" />
          </div>
          <div className="metric-value">{report.highest_ctc}</div>
          <div className="metric-sub">Amazon Development Center</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Average Package <TrendingUp size={15} color="#059669" />
          </div>
          <div className="metric-value">{report.average_ctc}</div>
          <div className="metric-sub">Mean institutional CTC</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Median Package <BarChart3 size={15} color="#2563eb" />
          </div>
          <div className="metric-value">{report.median_ctc}</div>
          <div className="metric-sub">50th Percentile mark</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Total Job Offers <FileText size={15} color="#7c3aed" />
          </div>
          <div className="metric-value">{report.total_offers_made}</div>
          <div className="metric-sub">Extended to {report.total_eligible_students} eligible students</div>
        </div>
        <div className="metric-item">
          <div className="metric-label">
            Companies Joined <Building2 size={15} color="#475569" />
          </div>
          <div className="metric-value">{report.companies_participated}</div>
          <div className="metric-sub">MOU & On-campus drives</div>
        </div>
      </div>

      {/* Dual Panel: Salary Bracket Breakdown + Top Recruiters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Salary Bracket Distribution */}
        <div className="integrated-panel" style={{ marginBottom: 0 }}>
          <div className="integrated-header">
            <div className="integrated-title">
              <BarChart3 size={18} /> Salary Package Distribution (CTC)
            </div>
          </div>
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Salary Bracket</th>
                  <th>Offers Count</th>
                  <th>Distribution Bar</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(report.salary_brackets).map(([bracket, count]) => {
                  const pct = Math.round((count / report.total_offers_made) * 100);
                  return (
                    <tr key={bracket}>
                      <td style={{ fontWeight: 700 }}>{bracket}</td>
                      <td style={{ fontWeight: 600 }}>{count} Offers</td>
                      <td style={{ width: '40%' }}>
                        <div
                          style={{
                            width: '100%',
                            height: '8px',
                            background: '#e2e8f0',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: 'var(--brand-accent)',
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Hiring Partners */}
        <div className="integrated-panel" style={{ marginBottom: 0 }}>
          <div className="integrated-header">
            <div className="integrated-title">
              <Building2 size={18} /> Top Recruiters by Volume
            </div>
          </div>
          <div className="table-wrapper">
            <table className="integrated-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Recruiting Organization</th>
                  <th>Hires Made</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.top_recruiters.map((recruiter, index) => (
                  <tr key={recruiter.name}>
                    <td style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>#{index + 1}</td>
                    <td style={{ fontWeight: 700 }}>{recruiter.name}</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>
                      {recruiter.hires} Candidates
                    </td>
                    <td>
                      <span className="badge badge-selected">Completed Wave</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
