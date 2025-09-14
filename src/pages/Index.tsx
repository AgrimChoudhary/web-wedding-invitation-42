import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WelcomeForm from '@/components/WelcomeForm';
import { FloatingPetals } from '@/components/AnimatedElements';
import { Sparkles, Heart, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import { formatWeddingDate } from '@/placeholders';

// Security: Define trusted origins
const TRUSTED_ORIGINS = [
  'https://utsavy-invitations.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://preview--utsavy-46.lovable.app/',
  'http://localhost:8080'
];

const isTrustedOrigin = (origin: string): boolean => {
  return TRUSTED_ORIGINS.includes(origin) || origin === window.location.origin;
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSparkle, setShowSparkle] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(0);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { guestName, setGuestName, setGuestId } = useGuest();
  const { weddingData, setAllWeddingData } = useWedding();
  
  const floatingIcons = [
    <Heart key="heart" className="text-wedding-blush" />,
    <Sparkles key="sparkles" className="text-wedding-gold" />,
    <Star key="star" className="text-wedding-maroon" />
  ];

  // Read URL parameters and update contexts
  useEffect(() => {
    console.log('🔗 Index page loaded with URL:', window.location.href);
    console.log('📍 Current pathname:', location.pathname);
    console.log('🔍 URL search params:', location.search);
    
    const params = new URLSearchParams(location.search);

    // Guest Data
    const guestNameParam = params.get('guestName');
    const guestIdParam = params.get('guestId');
    
    if (guestNameParam) {
      console.log('👤 Setting guest name from URL:', guestNameParam);
      setGuestName(guestNameParam);
    }
    
    if (guestIdParam) {
      console.log('🆔 Setting guest ID from URL:', guestIdParam);
      setGuestId(guestIdParam);
    }

    // Wedding Data (JSON string)
    const weddingDataParam = params.get('weddingData');
    if (weddingDataParam) {
      try {
        const parsedWeddingData = JSON.parse(decodeURIComponent(weddingDataParam));
        // Convert date string back to Date object if needed
        if (parsedWeddingData.mainWedding?.date) {
          parsedWeddingData.mainWedding.date = new Date(parsedWeddingData.mainWedding.date);
        }
        console.log('📊 Setting wedding data from URL');
        setAllWeddingData(parsedWeddingData);
      } catch (e) {
        console.error("URL se weddingData parse karne mein error:", e);
      }
    }
    
    // Log to help debug automatic navigation issues
    console.log('✅ Index page initialization complete');
  }, [location.search, setGuestName, setGuestId, setAllWeddingData]);

  // Set up message listener for platform communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check
      if (!isTrustedOrigin(event.origin)) {
        console.warn('Untrusted origin se message mila:', event.origin);
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'UPDATE_WEDDING_DATA':
          if (payload.mainWedding?.date) {
            payload.mainWedding.date = new Date(payload.mainWedding.date);
          }
          setAllWeddingData(payload);
          break;
        case 'UPDATE_GUEST_DATA':
          if (payload.guestName) setGuestName(payload.guestName);
          if (payload.guestId) setGuestId(payload.guestId);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAllWeddingData, setGuestName, setGuestId]);
  
  useEffect(() => {
    // Simulating assets loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Sparkle effect timing
    const sparkleTimer = setInterval(() => {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 700);
    }, 3000);

    // Rotating icons
    const iconTimer = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % floatingIcons.length);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(sparkleTimer);
      clearInterval(iconTimer);
    };
  }, []);

  return (
    <div className="min-h-screen pattern-background relative overflow-hidden">
      {/* Data Contract Validator - for development/testing */}
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner mb-4"></div>
          <p className="text-wedding-maroon font-dancing-script text-xl">Loading our love story...</p>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
          {/* Enhanced gradient background with multiple layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-cream via-wedding-blush/20 to-wedding-cream z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-wedding-gold/5 via-transparent to-wedding-maroon/5 z-0"></div>
          
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-wedding-gold/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-2 h-2 bg-wedding-maroon/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 bg-wedding-gold/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-32 w-2.5 h-2.5 bg-wedding-blush/60 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-8 w-8 h-8 border border-wedding-gold/20 rotate-45 animate-float"></div>
          <div className="absolute top-1/3 right-12 w-6 h-6 border border-wedding-maroon/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-1/4 left-16 w-5 h-5 bg-wedding-blush/30 rotate-12 animate-float" style={{ animationDelay: '2.5s' }}></div>
          
          <FloatingPetals />
          
          {/* Modern header with enhanced styling */}
          <div className="relative z-10 text-center mb-8">
            <div className="relative mb-6">
              {/* Decorative lines and elements */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
                <div className="w-3 h-3 rounded-full bg-wedding-gold/40 animate-pulse"></div>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
              </div>
              
              <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4 opacity-0 animate-fade-in-up relative inline-block">
                {weddingData.groomFirst 
                  ? `${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName}`
                  : `${weddingData.couple.brideFirstName} & ${weddingData.couple.groomFirstName}`
                }
                {showSparkle && (
                  <Sparkles 
                    size={isMobile ? 18 : 28} 
                    className="absolute text-wedding-gold animate-pulse-soft" 
                    style={{ 
                      top: isMobile ? '-12px' : '-18px', 
                      right: isMobile ? '-18px' : '-30px'
                    }} 
                  />
                )}
              </h1>
              
              {/* Enhanced subtitle with modern styling */}
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="relative inline-block">
                  <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-gold mb-3 relative z-10">
                    Wedding Invitation
                  </h2>
                  <div className="absolute inset-0 bg-wedding-gold/10 rounded-lg blur-sm transform scale-110"></div>
                </div>
                
                {/* Modern decorative separator */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold rounded-full"></div>
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-wedding-gold/40 animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-wedding-gold/20 animate-ping"></div>
                  </div>
                  <div className="h-[2px] w-20 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced date preview with modern card */}
            <div className="opacity-0 animate-fade-in mb-6" style={{ animationDelay: '0.6s' }}>
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-wedding-cream/80 to-wedding-blush/60 backdrop-blur-sm border border-wedding-gold/30 shadow-gold-soft">
                <p className="text-sm font-medium text-wedding-maroon flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-wedding-gold animate-pulse"></span>
                  Save the Date: {formatWeddingDate(weddingData.mainWedding.date)}
                  <span className="w-2 h-2 rounded-full bg-wedding-gold animate-pulse"></span>
                </p>
              </div>
            </div>
          </div>
          
          <WelcomeForm />
          
          {/* Enhanced decorative corner elements with modern touch */}
          <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-3xl opacity-40">
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-3xl opacity-40">
            <div className="absolute top-2 right-2 w-3 h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
          </div>
          
          {/* Floating icons for modern appeal */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-20 animate-float">
            {floatingIcons[currentIcon]}
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
            {floatingIcons[(currentIcon + 1) % floatingIcons.length]}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;