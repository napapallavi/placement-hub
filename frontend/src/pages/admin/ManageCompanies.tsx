import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { Company } from '../../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  Search,
} from 'lucide-react';

export const ManageCompanies: React.FC = () => {
  const { addToast } = useNotifications();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await api.getAllCompanies();
      if (Array.isArray(data)) setCompanies(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleVerification = async (companyId: number, currentStatus: boolean) => {
    try {
      await api.verifyCompany(companyId, !currentStatus);
      addToast('Verification Updated', `Company status changed to ${!currentStatus ? 'Verified' : 'Unverified'}.`, 'success');
      fetchCompanies();
    } catch (err: any) {
      addToast('Error', err.message || 'Could not update verification', 'warning');
    }
  };

  const filteredCompanies = companies.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      c.company_name.toLowerCase().includes(term) ||
      c.industry.toLowerCase().includes(term) ||
      c.location.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Hiring Partner Organizations
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Manage corporate recruiters, campus MOUs, and partner credentials.
        </div>
      </div>

      <div
        className="integrated-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search company by name, sector, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}
          />
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Building2 size={18} /> Registered Companies ({filteredCompanies.length})
          </div>
        </div>

        <div className="table-wrapper">
          <table className="integrated-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Sector</th>
                <th>Location</th>
                <th>HR Contact</th>
                <th>Active Vacancies</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.company_name}
                    </div>
                    {c.website && (
                      <a
                        href={c.website}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--brand-accent)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        {c.website.replace('https://', '')} <ExternalLink size={10} />
                      </a>
                    )}
                  </td>
                  <td>{c.industry}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{c.location}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {c.contact_email}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>
                      {c.active_jobs_count || 1} Open Roles
                    </span>
                  </td>
                  <td>
                    {c.is_verified ? (
                      <span className="badge badge-selected">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-review">Pending Verification</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${c.is_verified ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleVerification(c.id, c.is_verified)}
                    >
                      {c.is_verified ? 'Revoke Verification' : 'Verify Partner'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
