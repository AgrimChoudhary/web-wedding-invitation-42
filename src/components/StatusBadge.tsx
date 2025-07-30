import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'viewed' | 'accepted' | 'submitted';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    pending: { 
      label: 'Not Viewed', 
      className: 'bg-gray-100 text-gray-600 border-gray-200' 
    },
    viewed: { 
      label: 'Viewed', 
      className: 'bg-blue-100 text-blue-700 border-blue-200' 
    },
    accepted: { 
      label: 'Accepted', 
      className: 'bg-green-100 text-green-700 border-green-200' 
    },
    submitted: { 
      label: 'Completed', 
      className: 'bg-wedding-gold/10 text-wedding-gold border-wedding-gold/20' 
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};