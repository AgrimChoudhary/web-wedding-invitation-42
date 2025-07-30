import React from 'react';
import { Check, Eye, Heart, CheckCircle } from 'lucide-react';

interface RSVPProgressProps {
  currentStatus: 'pending' | 'viewed' | 'accepted' | 'submitted';
  className?: string;
}

export const RSVPProgress: React.FC<RSVPProgressProps> = ({ currentStatus, className = '' }) => {
  const steps = [
    { 
      key: 'pending', 
      label: 'Invited', 
      icon: Heart,
      description: 'Invitation sent'
    },
    { 
      key: 'viewed', 
      label: 'Viewed', 
      icon: Eye,
      description: 'Invitation opened'
    },
    { 
      key: 'accepted', 
      label: 'Accepted', 
      icon: Check,
      description: 'Invitation accepted'
    },
    { 
      key: 'submitted', 
      label: 'Completed', 
      icon: CheckCircle,
      description: 'RSVP completed'
    }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStatus);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${isCompleted 
                  ? 'bg-wedding-gold border-wedding-gold text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
                }
                ${isCurrent ? 'ring-4 ring-wedding-gold/20 scale-110' : ''}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${isCompleted ? 'text-wedding-gold' : 'text-gray-500'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {step.description}
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  absolute top-5 left-1/2 w-full h-0.5 -z-10
                  ${index < currentIndex ? 'bg-wedding-gold' : 'bg-gray-200'}
                `} 
                style={{ 
                  left: `calc(${((index + 1) / steps.length) * 100}% - ${50 / steps.length}%)`,
                  width: `${100 / steps.length}%`
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};