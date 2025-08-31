import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGuest } from '@/context/GuestContext';

interface NavigationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  currentPage, 
  totalPages,
  onPageChange 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { guestId } = useGuest();

  const pageRoutes = [
    '/',
    '/families',
    '/journey', 
    '/ceremonies',
    '/celebration'
  ];

  const pageNames = [
    'Welcome',
    'Families',
    'Love Story',
    'Ceremonies', 
    'Celebration'
  ];

  const getRouteWithParams = (route: string) => {
    const searchParams = location.search;
    if (guestId && route !== '/') {
      return `${route}${searchParams}`;
    }
    return route === '/' && guestId ? `/${guestId}${searchParams}` : `${route}${searchParams}`;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newRoute = getRouteWithParams(pageRoutes[currentPage - 2]);
      navigate(newRoute);
      onPageChange?.(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newRoute = getRouteWithParams(pageRoutes[currentPage]);
      navigate(newRoute);
      onPageChange?.(currentPage + 1);
    }
  };

  const goToPage = (page: number) => {
    const newRoute = getRouteWithParams(pageRoutes[page - 1]);
    navigate(newRoute);
    onPageChange?.(page);
  };

  return (
    <>
      {/* Progress Indicator */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-wedding-gold/20">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;
            
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`group relative flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'w-10 h-10' 
                    : 'w-8 h-8 hover:w-9 hover:h-9'
                }`}
                aria-label={`Go to ${pageNames[index]}`}
              >
                <div className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'bg-gradient-to-br from-wedding-gold to-wedding-gold/80 shadow-lg scale-110' 
                    : 'bg-wedding-gold/30 hover:bg-wedding-gold/50 group-hover:scale-105'
                }`} style={{ width: '100%', height: '100%' }}>
                  {pageNumber === 1 && <Home size={isActive ? 16 : 14} className={isActive ? 'text-white' : 'text-wedding-maroon'} />}
                  {pageNumber === 2 && <Crown size={isActive ? 16 : 14} className={isActive ? 'text-white' : 'text-wedding-maroon'} />}
                  {pageNumber > 2 && (
                    <span className={`font-semibold ${isActive ? 'text-white' : 'text-wedding-maroon'} text-sm`}>
                      {pageNumber}
                    </span>
                  )}
                </div>
                
                {/* Active glow effect */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-wedding-gold/30 animate-ping"></div>
                )}
                
                {/* Tooltip */}
                {!isMobile && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {pageNames[index]}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size={isMobile ? "default" : "lg"}
            className="royal-nav-button group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={isMobile ? 18 : 20} className="mr-2" />
            <span className="font-medium">Previous</span>
          </Button>

          <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-wedding-maroon border border-wedding-gold/20">
            <span className="text-wedding-gold">{currentPage}</span> of {totalPages}
          </div>

          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline" 
            size={isMobile ? "default" : "lg"}
            className="royal-nav-button group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-medium">Next</span>
            <ChevronRight size={isMobile ? 18 : 20} className="ml-2" />
          </Button>
        </div>
      </div>

      <style>{`
        .royal-nav-button {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,249,239,0.9) 100%);
          border: 2px solid rgba(212,175,55,0.3);
          color: hsl(var(--wedding-maroon));
          border-radius: 25px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212,175,55,0.1);
        }

        .royal-nav-button:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(254,249,239,1) 100%);
          border-color: rgba(212,175,55,0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212,175,55,0.2);
        }

        .royal-nav-button:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 0 4px 15px rgba(212,175,55,0.1);
        }
      `}</style>
    </>
  );
};

export default NavigationBar;