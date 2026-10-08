import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNotifications } from '../../context/NotificationContext';
import { Company } from '../../types';
import { Building2, Save, Globe, MapPin, Mail, CheckCircle2 } from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  const { addToast } = useNotifications();

  const [company, setCompany] = useState<Partial<Company>>({
    company_name: 'Google India',
    industry: 'Technology & Cloud Computing',
    website: 'https://careers.google.com',
    location: 'Bengaluru & Hyderabad',
    contact_email: 'university-recruiting@google.com',
    description:
      "Google builds products to help organize the world's information and make it universally accessible and useful. We hire top software engineers for cloud and infrastructure teams.",
    is_verified: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await api.getCompanyProfile();
        if (data) setCompany(data);
      } catch {
        // fallback
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateCompanyProfile(company);
      addToast('Profile Updated', 'Company information updated successfully.', 'success');
    } catch (err: any) {
      addToast('Error', err.message || 'Could not save company profile.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Company Profile
        </h1>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Information presented to student candidates during campus recruitment.
        </div>
      </div>

      <div className="integrated-panel">
        <div className="integrated-header">
          <div className="integrated-title">
            <Building2 size={18} /> Organization Information
          </div>
          {company.is_verified && (
            <span className="badge badge-selected">
              <CheckCircle2 size={12} /> Verified Institutional Partner
            </span>
          )}
        </div>

        <form className="integrated-body" onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={company.company_name || ''}
                onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Industry Domain</label>
              <input
                type="text"
                className="form-input"
                value={company.industry || ''}
                onChange={(e) => setCompany({ ...company, industry: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Official Website</label>
              <input
                type="url"
                className="form-input"
                value={company.website || ''}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Office / Branch Location</label>
              <input
                type="text"
                className="form-input"
                value={company.location || ''}
                onChange={(e) => setCompany({ ...company, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Campus HR Contact Email</label>
            <input
              type="email"
              className="form-input"
              value={company.contact_email || ''}
              onChange={(e) => setCompany({ ...company, contact_email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Description & Mission</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={company.description || ''}
              onChange={(e) => setCompany({ ...company, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
