
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import { useAudio } from '@/context/AudioContext';
import { usePlatform } from '@/context/PlatformContext';
import { Button } from '@/components/ui/button';
import InvitationHeader from '@/components/InvitationHeader';
import CoupleSection from '@/components/CoupleSection';
import CountdownTimer from '@/components/CountdownTimer';
import FamilyDetails from '@/components/FamilyDetails';
import RomanticJourneySection from '@/components/RomanticJourneySection';
import EventTimeline from '@/components/EventTimeline';
import PhotoGrid from '@/components/PhotoGrid';
import WishesCarousel from '@/components/WishesCarousel';
import WishesModal from '@/components/WishesModal';
import Footer from '@/components/Footer';
import { RSVPSection } from '@/components/RSVPSection';
import { FloatingPetals, Confetti, FireworksDisplay } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Heart, MapPin, User, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import AnimatedGuestName from '../components/AnimatedGuestName';

// Security: Define trusted origins
const TRUSTED_ORIGINS = [
  'https://utsavy-invitations.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080'
];

const isTrustedOrigin = (origin: string): boolean => {
  return TRUSTED_ORIGINS.includes(origin) || origin === window.location.origin;
};

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showWishesModal, setShowWishesModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [showGaneshaTransition, setShowGaneshaTransition] = useState(false);
  const [hideGaneshaTransition, setHideGaneshaTransition] = useState(false);
  const [startGuestNameAnimation, setStartGuestNameAnimation] = useState(false);
  const { guestName, isLoading: isGuestLoading, updateGuestStatus, guestId, hasAccepted, setGuestName, setGuestId } = useGuest();
  const { weddingData, setAllWeddingData } = useWedding();
  const { isPlaying, toggleMusic } = useAudio();
  const { isPlatformMode, trackInvitationViewed, guestStatus, rsvpConfig } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Read URL parameters and update contexts
  useEffect(() => {
    // Track invitation view start time for analytics
    const startTime = Date.now();
    
    const params = new URLSearchParams(location.search);

    // Guest Data
    const guestNameParam = params.get('guestName');
    const guestIdParam = params.get('guestId');
    
    if (guestNameParam) {
      setGuestName(guestNameParam);
    }
    
    if (guestIdParam) {
      setGuestId(guestIdParam);
    }

    // Wishes via URL (for immediate render)
    const wishesParam = params.get('wishes');
    if (wishesParam) {
      try {
        const decoded = JSON.parse(wishesParam);
        if (Array.isArray(decoded)) {
          // Broadcast to wishes hook via postMessage-style dispatch
          window.postMessage({
            type: 'INITIAL_WISHES_DATA',
            payload: { wishes: decoded }
          }, window.location.origin);
          console.log('✅ URL wishes parsed and dispatched to wishes hook:', decoded.length);
        }
      } catch (e) {
        console.warn('Failed to parse wishes from URL:', e);
      }
    }

    // Start with a copy of current wedding data
    let updatedWeddingData = { ...weddingData };

    // First, handle weddingData JSON parameter if it exists
    const weddingDataParam = params.get('weddingData');
    if (weddingDataParam) {
      try {
        const parsedWeddingData = JSON.parse(decodeURIComponent(weddingDataParam));
        // Merge parsed wedding data with current data
        updatedWeddingData = {
          ...updatedWeddingData,
          ...parsedWeddingData
        };
      } catch (e) {
        console.error("Error parsing weddingData from URL:", e);
      }
    }

    // Then, process individual parameters and override/merge with wedding data
    const individualParams = {
      groomName: params.get('groomName'),
      brideName: params.get('brideName'),
      groomCity: params.get('groomCity'),
      brideCity: params.get('brideCity'),
      groomFirst: params.get('groomFirst'),
      weddingDate: params.get('weddingDate'),
      weddingTime: params.get('weddingTime'),
      venueName: params.get('venueName'),
      venueAddress: params.get('venueAddress'),
      venueMapLink: params.get('venueMapLink'),
      groomFamilyPhoto: params.get('groomFamilyPhoto'),
      brideFamilyPhoto: params.get('brideFamilyPhoto'),
      groomParentsName: params.get('groomParentsName'),
      brideParentsName: params.get('brideParentsName'),
      couplePhotoUrl: params.get('couplePhotoUrl'),
      coupleImage: params.get('coupleImage')
    };

    // Update wedding data with individual parameters
    if (individualParams.groomName || individualParams.brideName) {
      updatedWeddingData.couple = {
        ...updatedWeddingData.couple,
        groomFirstName: individualParams.groomName || updatedWeddingData.couple.groomFirstName,
        brideFirstName: individualParams.brideName || updatedWeddingData.couple.brideFirstName,
        groomCity: individualParams.groomCity || updatedWeddingData.couple.groomCity,
        brideCity: individualParams.brideCity || updatedWeddingData.couple.brideCity,
        couplePhotoUrl: individualParams.couplePhotoUrl || updatedWeddingData.couple.couplePhotoUrl,
        coupleImageUrl: individualParams.coupleImage || updatedWeddingData.couple.coupleImageUrl
      };
    }

    // Handle groomFirst parameter
    if (individualParams.groomFirst !== null) {
      updatedWeddingData.groomFirst = individualParams.groomFirst === 'true';
    }

    // Handle wedding date and time
    if (individualParams.weddingDate) {
      try {
        updatedWeddingData.mainWedding = {
          ...updatedWeddingData.mainWedding,
          date: new Date(individualParams.weddingDate),
          time: individualParams.weddingTime || updatedWeddingData.mainWedding.time
        };
      } catch (e) {
        console.error("Error parsing wedding date:", e);
      }
    }

    // Handle venue information
    if (individualParams.venueName) {
      updatedWeddingData.mainWedding = {
        ...updatedWeddingData.mainWedding,
        venue: {
          name: individualParams.venueName,
          address: individualParams.venueAddress || updatedWeddingData.mainWedding.venue.address || '',
          mapLink: individualParams.venueMapLink || updatedWeddingData.mainWedding.venue.mapLink
        }
      };
    }

    // Handle family photos and parent names
    if (individualParams.groomFamilyPhoto || individualParams.groomParentsName) {
      updatedWeddingData.family = {
        ...updatedWeddingData.family,
        groomFamily: {
          ...updatedWeddingData.family.groomFamily,
          familyPhotoUrl: individualParams.groomFamilyPhoto || updatedWeddingData.family.groomFamily.familyPhotoUrl,
          parentsNameCombined: individualParams.groomParentsName || updatedWeddingData.family.groomFamily.parentsNameCombined
        }
      };
    }

    if (individualParams.brideFamilyPhoto || individualParams.brideParentsName) {
      updatedWeddingData.family = {
        ...updatedWeddingData.family,
        brideFamily: {
          ...updatedWeddingData.family.brideFamily,
          familyPhotoUrl: individualParams.brideFamilyPhoto || updatedWeddingData.family.brideFamily.familyPhotoUrl,
          parentsNameCombined: individualParams.brideParentsName || updatedWeddingData.family.brideFamily.parentsNameCombined
        }
      };
    }

    // Ensure mainWedding.date is a Date object
    if (updatedWeddingData.mainWedding?.date && typeof updatedWeddingData.mainWedding.date === 'string') {
      try {
        updatedWeddingData.mainWedding.date = new Date(updatedWeddingData.mainWedding.date);
      } catch (e) {
        console.error("Error converting date string to Date object:", e);
        // Fallback to a default date if conversion fails
        updatedWeddingData.mainWedding.date = new Date('2024-12-15');
      }
    }

    // Update wedding data if any changes were made
    setAllWeddingData(updatedWeddingData);

    // RSVP Status - Don't auto-accept from URL parameters
    const hasRespondedParam = params.get('hasResponded');
    const acceptedParam = params.get('accepted');
    
    // Block automatic acceptance from URL parameters
    if (hasRespondedParam === 'true' && acceptedParam === 'true') {
      console.log('🚫 Blocked automatic acceptance from URL parameters');
      // Don't set showThankYouMessage automatically
    }

    console.log('Final wedding data:', updatedWeddingData);

    // Track invitation viewed immediately when invitation loads
    setTimeout(() => {
      trackInvitationViewed();
    }, 1000); // Give a short delay to ensure page is loaded
  }, [location.search, setGuestName, setGuestId, setAllWeddingData, trackInvitationViewed]);

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
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Start Ganesha transition immediately after loading completes
      setTimeout(() => {
        setShowGaneshaTransition(true);
        // Hide the transition element after faster animation completes (2s instead of 4s)
        setTimeout(() => {
          setHideGaneshaTransition(true);
          // Start guest name animation after Ganesha transition completes
          setTimeout(() => {
            setStartGuestNameAnimation(true);
          }, 200);
        }, 2000); // Reduced from 4000ms to 2000ms for faster transition
      }, 100); // Reduced delay for immediate start
    }, 1500);
    
    // Removed automatic thank you message showing on page load
    // The thank you message should only show after explicit user acceptance
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-show Thank You in simple mode if guest already accepted (from platform)
  useEffect(() => {
    if (rsvpConfig === 'simple' && guestStatus === 'accepted') {
      setShowThankYouMessage(true);
    }
    // For detailed: do not force thank-you; allow RSVPSection to show Submit/Edit
  }, [rsvpConfig, guestStatus]);
  
  const handleOpenRSVP = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowRSVP(true);
      setConfetti(false);
    }, 800);
  };

  const handleAcceptInvitation = () => {
    console.log('🎯 handleAcceptInvitation: User manually clicked Accept Invitation');
    console.log('📊 Current state:', { guestId, showThankYouMessage });
    
    // Prevent multiple rapid clicks
    if (showThankYouMessage) {
      console.log('⚠️ handleAcceptInvitation: Already accepted, ignoring duplicate action');
      return;
    }
    
    setConfetti(true);
    
    // This function is deprecated - RSVP handling should go through PlatformContext
    console.log('⚠️ handleAcceptInvitation called - consider using PlatformContext sendRSVP instead');
    
    console.log('✅ Processing invitation acceptance');
    try {
      updateGuestStatus('accepted');
      setTimeout(() => {
        console.log('🎉 Showing thank you message after user acceptance');
        setShowThankYouMessage(true);
        setConfetti(false);
      }, 800);
    } catch (error) {
      console.warn('⚠️ Failed to update guest status:', error);
      // Still show thank you message even if status update fails
      setTimeout(() => {
        setShowThankYouMessage(true);
        setConfetti(false);
      }, 800);
    }
  };
  
  // Get guestId from path to use for navigation
  const getCurrentGuestId = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length === 2 && pathParts[0] === 'invitation') {
      return pathParts[1];
    }
    return null;
  };
  
  const currentGuestId = getCurrentGuestId();

  return (
    <div className="min-h-screen w-full pattern-background">
      {isLoading ? (
        <div className="loading-overlay flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="loading-spinner mb-4 w-16 h-16 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-wedding-gold/10 rounded-full animate-pulse-soft"></div>
          </div>
          
          {/* Ganesha Image in Loading Screen */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-xl animate-pulse-soft"></div>
            <div className="relative bg-gradient-to-br from-orange-50/90 via-yellow-50/95 to-orange-50/90 backdrop-blur-lg rounded-full p-6 border border-orange-200/60">
              <img 
                src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                alt="Lord Ganesha" 
                className="w-24 h-24 object-contain animate-floating"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-wedding-maroon font-dancing-script text-xl md:text-2xl mb-2">Preparing your invitation...</p>
            
            <div className="mb-3 mt-1 relative">
              <h3 className="font-great-vibes text-xl md:text-2xl text-wedding-gold">
                Dear <span className="relative inline-block min-w-[80px]">
                  {isGuestLoading ? (
                    <span className="absolute inset-0 w-full h-6 bg-wedding-gold/10 rounded animate-pulse"></span>
                  ) : (
                    <span className="font-great-vibes gold-highlight animate-shimmer">{guestName || "Guest"}</span>
                  )}
                </span>
              </h3>
              
              <div className="mt-1 mx-auto w-32 h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
            </div>
            
            <p className="text-wedding-gold/70 text-sm md:text-base font-dancing-script">
              The celebration awaits<span className="loading-dots"></span>
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
          {/* Enhanced Transitioning Ganesha Image with faster animation */}
          {showGaneshaTransition && !hideGaneshaTransition && (
            <div 
              className="fixed inset-0 z-50 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.3) 70%, transparent 100%)'
              }}
            >
              <div className="ganesha-transition-container-fast">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-xl animate-pulse-soft"></div>
                  <div className="relative bg-gradient-to-br from-orange-50/90 via-yellow-50/95 to-orange-50/90 backdrop-blur-lg rounded-full p-6 border border-orange-200/60">
                    <img 
                      src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                      alt="Lord Ganesha" 
                      className="w-24 h-24 object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <FloatingPetals />
          <Confetti isActive={confetti} />
          
          <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-3">
            <Button 
              onClick={toggleMusic}
              variant="outline"
              size="icon"
              className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
              aria-label={isPlaying ? "Mute music" : "Play music"}
            >
              {isPlaying ? (
                <Volume2 size={18} className="text-wedding-maroon" />
              ) : (
                <VolumeX size={18} className="text-wedding-maroon" />
              )}
            </Button>
            
            {!isMobile && (
              <Button 
                onClick={() => currentGuestId ? navigate(`/${currentGuestId}${location.search}`) : navigate(`/${location.search}`)}
                variant="outline"
                size="icon"
                className="rounded-full bg-wedding-cream/80 backdrop-blur-sm border-wedding-gold/30 hover:bg-wedding-cream shadow-gold-soft"
                aria-label="Go back"
              >
                <ArrowLeftCircle size={18} className="text-wedding-maroon" />
              </Button>
            )}
          </div>
          
          {isMobile && (
            <button 
              onClick={() => currentGuestId ? navigate(`/${currentGuestId}${location.search}`) : navigate(`/${location.search}`)}
              className="fixed top-4 left-4 z-30 flex items-center text-wedding-maroon hover:text-wedding-gold transition-colors duration-300 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeftCircle size={16} className="mr-1" />
              <span className="text-xs">Back</span>
            </button>
          )}
          
          <InvitationHeader 
            startGuestNameAnimation={startGuestNameAnimation}
          />
          
          {/* Section ordering: countdown, family details, romantic journey, wedding journey, events, photos, wishes */}
          <CountdownTimer 
            weddingDate={weddingData.mainWedding.date} 
            weddingTime={weddingData.mainWedding.time}
          />
          
          <FamilyDetails />

          {/* New Romantic Journey Section */}
          <RomanticJourneySection />

          <CoupleSection />
  
          <EventTimeline />
          
          <PhotoGrid
            title="Our Photo Gallery" 
          />

          {/* New Wishes Carousel Section */}
          <WishesCarousel onViewAll={() => setShowWishesModal(true)} />
          
          {/* Enhanced Accept Invitation Section with Visual Focus */}
          <div className="py-16 w-full text-center relative overflow-hidden">
            {/* Spotlight Background Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-wedding-gold/10 via-wedding-cream/20 to-transparent"></div>
            
            {/* Subtle Border Lines Leading to Button */}
            <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-8 h-px bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
            
            {/* Decorative Side Lines */}
            <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-px h-24 md:h-32 bg-gradient-to-b from-transparent via-wedding-gold/40 to-transparent"></div>
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-px h-24 md:h-32 bg-gradient-to-b from-transparent via-wedding-gold/40 to-transparent"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto px-4">
              {/* Focus Ring Around Content */}
              <div className="absolute -inset-8 md:-inset-12 rounded-3xl border-2 border-wedding-gold/20 opacity-60 animate-pulse"></div>
              <div className="absolute -inset-4 md:-inset-6 rounded-2xl border border-wedding-gold/30 opacity-40"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-wedding-gold/20">
                {/* Check if user has explicitly accepted (not from platform data) */}
                {showThankYouMessage ? (
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-playfair text-wedding-maroon mb-2">
                      {isGuestLoading ? (
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      ) : (
                        <>
                          Dear{' '}
                          <AnimatedGuestName 
                            name={guestName}
                            animationType="brush"
                            className="font-playfair text-wedding-maroon"
                            delay={700}
                            fallback="Guest Name"
                          />,
                        </>
                      )}
                    </h3>
                    <h3 className="text-xl md:text-2xl font-playfair text-wedding-maroon mb-4">Thank You for Accepting!</h3>
                    <p className="text-gray-600 mb-4 font-poppins">We are extremely excited to celebrate our special day with you!</p>
                    <p className="text-sm text-wedding-maroon italic font-poppins">
                      We are truly honored to have you join us in our celebration of love and commitment.
                    </p>
                  </div>
                ) : (
                  <RSVPSection />
                )}
              </div>
            </div>
          </div>
          
          <Footer />
          
          {/* RSVPSection is now used earlier in the component */}
          <WishesModal open={showWishesModal} onOpenChange={setShowWishesModal} />
        </div>
      )}
    </div>
  );
};

export default Invitation;
