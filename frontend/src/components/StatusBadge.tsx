import React from 'react';
import { ApplicationStatus } from '../types';
import { Clock, Eye, Star, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: ApplicationStatus | string;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  switch (status) {
    case 'Applied':
      return (
        <span className="badge badge-applied">
          <Clock size={12} /> Applied
        </span>
      );
    case 'Under Review':
      return (
        <span className="badge badge-review">
          <Eye size={12} /> Under Review
        </span>
      );
    case 'Shortlisted':
      return (
        <span className="badge badge-shortlisted">
          <Star size={12} /> Shortlisted
        </span>
      );
    case 'Interview Scheduled':
      return (
        <span className="badge badge-interview">
          <Calendar size={12} /> Interview Scheduled
        </span>
      );
    case 'Selected':
      return (
        <span className="badge badge-selected">
          <CheckCircle2 size={12} /> Selected / Offered
        </span>
      );
    case 'Rejected':
      return (
        <span className="badge badge-rejected">
          <XCircle size={12} /> Rejected
        </span>
      );
    default:
      return <span className="badge badge-applied">{status}</span>;
  }
};
