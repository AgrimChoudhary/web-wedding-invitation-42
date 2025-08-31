import React from 'react';
import { FloatingPetals } from './AnimatedElements';

interface PageWrapperProps {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  pageNumber, 
  totalPages, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen w-full pattern-background relative ${className}`}>
      <FloatingPetals />
      
      {/* Royal background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5 pointer-events-none"></div>
      <div className="absolute top-20 left-20 w-3 h-3 bg-wedding-gold/40 rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-24 right-24 w-4 h-4 bg-wedding-maroon/30 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-32 right-32 w-2 h-2 bg-wedding-gold/50 rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2.5s' }}></div>
      
      <main className="relative z-10 min-h-screen w-full flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;