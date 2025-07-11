import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import { useWedding } from '../context/WeddingContext';
import { useAudio } from '../context/AudioContext';
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Calendar, Volume2, VolumeX, Crown, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatWeddingDate } from '@/placeholders';
import AnimatedGuestName from './AnimatedGuestName';

const WelcomeForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showIcon, setShowIcon] = useState(0);
  const { isPlaying, toggleMusic } = useAudio();
  const { guestName, isLoading: isGuestLoading, guestId } = useGuest();
  const { weddingData } = useWedding();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const icons = [
    <Heart key="heart" className="text-wedding-blush" />,
    <Sparkles key="sparkles" className="text-wedding-gold" />,
    <Crown key="crown" className="text-wedding-maroon" />,
    <Star key="star" className="text-wedding-gold" />
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon((prev) => (prev + 1) % icons.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOpenInvitation = () => {
    setIsLoading(true);
    
    // Send INVITATION_VIEWED message to parent platform
    if (guestId) {
      window.parent.postMessage({
        type: 'INVITATION_VIEWED',
        payload: {
          guestId: guestId,
          eventId: weddingData.events[0]?.id || 'default-event-id'
        }
      }, '*');
    }
    
    // Simulate loading for better UX
    setTimeout(() => {
      // Extract guestId from the path if present
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const currentGuestId = pathParts.length === 1 && pathParts[0] !== 'invitation' ? pathParts[0] : '';
      
      // Navigate to invitation page with guestId if available
      if (currentGuestId) {
        navigate(`/invitation/${currentGuestId}${window.location.search}`);
      } else {
        navigate(`/invitation${window.location.search}`);
      }
    }, 800);
  };

  // Determine which name to show first based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? weddingData.couple.groomFirstName : weddingData.couple.brideFirstName;
  const secondPersonName = weddingData.groomFirst ? weddingData.couple.brideFirstName : weddingData.couple.groomFirstName;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-6 py-8">
      <div className="relative w-full p-8 flex flex-col items-center space-y-6 overflow-hidden border-2 border-wedding-gold/20 rounded-2xl bg-gradient-to-br from-white/95 via-wedding-cream/80 to-wedding-blush/40 backdrop-blur-lg shadow-2xl">
        {/* Enhanced glass effect with modern styling */}
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5 rounded-2xl"></div>
        <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
        
        {/* Modern corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-3 border-l-3 border-wedding-gold/40 rounded-tl-2xl">
          <div className="absolute top-2 left-2 w-2 h-2 bg-wedding-gold/50 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 border-t-3 border-r-3 border-wedding-gold/40 rounded-tr-2xl">
          <div className="absolute top-2 right-2 w-2 h-2 bg-wedding-gold/50 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-3 border-l-3 border-wedding-gold/40 rounded-bl-2xl">
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-wedding-gold/50 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-3 border-r-3 border-wedding-gold/40 rounded-br-2xl">
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-wedding-gold/50 rounded-full animate-pulse"></div>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute left-3 top-3 w-14 h-14 opacity-15">
          <img src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" alt="Decorative element" className="w-full h-full animate-pulse-soft" />
        </div>
        <div className="absolute right-3 top-3 w-14 h-14 opacity-15">
          <img src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" alt="Decorative element" className="w-full h-full animate-pulse-soft" />
        </div>
        
        {/* Enhanced floating icons with modern positioning */}
        <div className="absolute -left-3 top-1/4 opacity-25 animate-float">
          <Heart size={28} className="text-wedding-blush drop-shadow-lg" />
        </div>
        <div className="absolute -right-3 top-1/3 opacity-25 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles size={24} className="text-wedding-gold drop-shadow-lg" />
        </div>
        <div className="absolute left-1/4 -bottom-3 opacity-25 animate-float" style={{ animationDelay: '2s' }}>
          <Crown size={22} className="text-wedding-maroon drop-shadow-lg" />
        </div>
        <div className="absolute right-1/4 -top-3 opacity-25 animate-float" style={{ animationDelay: '3s' }}>
          <Star size={20} className="text-wedding-gold drop-shadow-lg" />
        </div>
        
        {/* Enhanced header section */}
        <div className="text-center mb-4 opacity-0 animate-fade-in-up relative z-10" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-wedding-gold/70 rounded-full"></div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-wedding-gold/40 bg-gradient-to-br from-wedding-cream to-wedding-blush/30 animate-pulse-soft">
                {icons[showIcon]}
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-wedding-gold/10 animate-ping"></div>
            </div>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-wedding-gold/70 rounded-full"></div>
          </div>
          
          <h2 className="text-2xl font-playfair text-wedding-maroon mb-2 relative">
            {isGuestLoading ? (
              <span className="inline-block w-48 h-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></span>
            ) : (
              <>
                Welcome{' '}
                <AnimatedGuestName 
                  name={guestName}
                  animationType="brush"
                  className="font-playfair bg-gradient-to-r from-wedding-gold to-wedding-maroon bg-clip-text text-transparent"
                  delay={600}
                  fallback="Guest Name"
                />
              </>
            )}
          </h2>
          <p className="text-sm text-gray-600 font-medium">Your special invitation awaits</p>
        </div>
        
        {/* Enhanced invitation text with modern styling */}
        <div className="text-center opacity-0 animate-fade-in-up relative z-10" style={{ animationDelay: '0.6s' }}>
          <div className="absolute -left-8 -top-8 text-7xl text-wedding-gold/8 font-great-vibes">"</div>
          <div className="relative px-6 py-4 rounded-xl bg-gradient-to-r from-wedding-cream/60 to-wedding-blush/40 backdrop-blur-sm border border-wedding-gold/20">
            <p className="text-wedding-maroon font-kruti text-xl md:text-2xl relative z-10 leading-relaxed">
              {firstPersonName} & {secondPersonName} cordially invite you to celebrate their wedding
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 text-7xl text-wedding-gold/8 font-great-vibes">"</div>
        </div>
        
        {/* Enhanced decorative separator */}
        <div className="w-full flex items-center justify-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-wedding-gold/40 to-wedding-gold/60 rounded-full"></div>
          <div className="w-3 h-3 rounded-full bg-wedding-gold/40 animate-pulse"></div>
          <div className="h-[2px] w-16 bg-gradient-to-l from-transparent via-wedding-gold/40 to-wedding-gold/60 rounded-full"></div>
        </div>
        
        {/* Enhanced CTA button */}
        <div 
          className="opacity-0 animate-fade-in-up z-10 relative" 
          style={{ animationDelay: '1s' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <Button
            onClick={handleOpenInvitation}
            disabled={isLoading}
            className={`relative overflow-hidden bg-gradient-to-r from-wedding-blush to-wedding-blush/90 text-wedding-maroon hover:from-wedding-blush/90 hover:to-wedding-blush/80 px-10 py-7 rounded-2xl transition-all duration-500 border-2 border-wedding-gold/30 ${
              isHovered ? 'shadow-2xl shadow-wedding-gold/40 transform scale-105' : 'shadow-xl shadow-wedding-gold/20'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-wedding-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Opening
              </span>
            ) : (
              <span className="flex items-center font-semibold text-lg">
                {isMobile ? 'Open' : 'Open Invitation'}
                <Heart
                  size={isMobile ? 20 : 24}
                  className={`ml-3 transition-all duration-300 ${isHovered ? 'scale-125 text-red-500' : 'scale-100'}`}
                  fill={isHovered ? "#FFC0CB" : "none"}
                />
              </span>
            )}
            {isHovered && (
              <>
                <span className="absolute inset-0 bg-wedding-gold/15 animate-pulse-soft rounded-2xl" aria-hidden="true" />
                <span className="absolute -inset-2 bg-wedding-gold/10 rounded-2xl blur-lg"></span>
              </>
            )}
          </Button>
        </div>
        
        {/* Enhanced music control button */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={toggleMusic}
            className="p-3 rounded-full bg-gradient-to-br from-wedding-cream/90 to-wedding-blush/70 border-2 border-wedding-gold/30 text-wedding-maroon hover:from-wedding-cream hover:to-wedding-blush/80 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
        
        {/* Enhanced bottom decorative element */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-2">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-wedding-gold/40 to-transparent rounded-full"></div>
        </div>
      </div>
      
      {/* Enhanced date teaser with modern card design */}
      <div className="mt-8 text-center opacity-0 animate-fade-in" style={{ animationDelay: '1.4s' }}>
        <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-wedding-cream/80 via-wedding-blush/60 to-wedding-cream/80 text-wedding-maroon border-2 border-wedding-gold/30 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-dancing-script font-semibold flex items-center gap-2">
            <Calendar size={16} className="text-wedding-gold animate-pulse" />
            Save the Date: {formatWeddingDate(weddingData.mainWedding.date)}
            <Sparkles size={14} className="text-wedding-gold animate-pulse" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;