import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface DeadlineDisplayProps {
  rsvpClosed: boolean;
  deadlineMessage?: string | null;
  className?: string;
}

export const DeadlineDisplay: React.FC<DeadlineDisplayProps> = ({ 
  rsvpClosed, 
  deadlineMessage, 
  className = '' 
}) => {
  // Only show if deadline is closed or there's a deadline message
  if (!rsvpClosed && !deadlineMessage) {
    return null;
  }

  return (
    <div className={`
      flex items-center gap-3 p-4 rounded-xl border 
      ${rsvpClosed 
        ? 'bg-red-50 border-red-200 text-red-700' 
        : 'bg-amber-50 border-amber-200 text-amber-700'
      } 
      ${className}
    `}>
      {rsvpClosed ? (
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <Clock className="w-5 h-5 flex-shrink-0" />
      )}
      
      <div className="flex-1">
        {rsvpClosed ? (
          <div>
            <p className="font-medium text-sm">RSVP Deadline Passed</p>
            {deadlineMessage && (
              <p className="text-sm mt-1">{deadlineMessage}</p>
            )}
          </div>
        ) : (
          deadlineMessage && (
            <p className="text-sm font-medium">{deadlineMessage}</p>
          )
        )}
      </div>
    </div>
  );
};