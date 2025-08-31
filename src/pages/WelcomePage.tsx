import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import { useAudio } from '@/context/AudioContext';
import { usePlatform } from '@/context/PlatformContext';
import PageWrapper from '@/components/PageWrapper';
import NavigationBar from '@/components/NavigationBar';
import WelcomeForm from '@/components/WelcomeForm';
import { Confetti } from '@/components/AnimatedElements';

const WelcomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [showGaneshaTransition, setShowGaneshaTransition] = useState(false);
  const [hideGaneshaTransition, setHideGaneshaTransition] = useState(false);
  const [startGuestNameAnimation, setStartGuestNameAnimation] = useState(false);
  
  const { guestName, isLoading: isGuestLoading, updateGuestStatus, guestId, setGuestName, setGuestId } = useGuest();
  const { weddingData, setAllWeddingData } = useWedding();
  const { trackInvitationViewed } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize data from URL parameters (same logic as original Index.tsx)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const guestNameParam = params.get('guestName');
    const guestIdParam = params.get('guestId');
    
    if (guestNameParam) setGuestName(guestNameParam);
    if (guestIdParam) setGuestId(guestIdParam);

    // Handle wedding data updates
    let updatedWeddingData = { ...weddingData };
    
    const weddingDataParam = params.get('weddingData');
    if (weddingDataParam) {
      try {
        const parsedWeddingData = JSON.parse(decodeURIComponent(weddingDataParam));
        updatedWeddingData = { ...updatedWeddingData, ...parsedWeddingData };
      } catch (e) {
        console.error('Error parsing wedding data:', e);
      }
    }

    // Handle individual parameters
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

    if (individualParams.groomFirst !== null) {
      updatedWeddingData.groomFirst = individualParams.groomFirst === 'true';
    }

    if (individualParams.weddingDate) {
      try {
        updatedWeddingData.mainWedding = {
          ...updatedWeddingData.mainWedding,
          date: new Date(individualParams.weddingDate),
          time: individualParams.weddingTime || updatedWeddingData.mainWedding.time
        };
      } catch (e) {
        console.error('Error parsing wedding date:', e);
      }
    }

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
        updatedWeddingData.mainWedding.date = new Date('2024-12-15');
      }
    }

    setAllWeddingData(updatedWeddingData);

    setTimeout(() => {
      trackInvitationViewed();
    }, 1000);
  }, [location.search, setGuestName, setGuestId, setAllWeddingData, trackInvitationViewed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowGaneshaTransition(true);
        setTimeout(() => {
          setHideGaneshaTransition(true);
          setTimeout(() => {
            setStartGuestNameAnimation(true);
          }, 200);
        }, 2000);
      }, 100);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full pattern-background">
        <div className="loading-overlay flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="loading-spinner mb-4 w-16 h-16 border-4 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-4 border-wedding-gold/10 rounded-full animate-pulse-soft"></div>
          </div>
          
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
      </div>
    );
  }

  return (
    <PageWrapper pageNumber={1} totalPages={5}>
      <Confetti isActive={confetti} />
      
      {/* Enhanced Transitioning Ganesha Image */}
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

      <div className="flex-grow flex items-center justify-center">
        <WelcomeForm />
      </div>

      <NavigationBar currentPage={1} totalPages={5} />
    </PageWrapper>
  );
};

export default WelcomePage;