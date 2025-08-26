import React, { useState, useEffect } from 'react';
import { TemplateProps } from '@/types/template';
import { useAudio } from '@/context/AudioContext';
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
import { FloatingPetals, Confetti } from '@/components/AnimatedElements';
import { ArrowLeftCircle, Volume2, VolumeX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedGuestName from '@/components/AnimatedGuestName';

export const RoyalTemplate: React.FC<TemplateProps> = ({
  weddingData,
  guestName,
  guestId,
  platformData,
  isPlatformMode,
  rsvpConfig,
  showEditButton,
  wishesEnabled,
  onAcceptInvitation,
  onOpenRSVP,
  onOpenWishes,
  isLoading = false
}) => {
  const [showRSVP, setShowRSVP] = useState(false);
  const [showWishesModal, setShowWishesModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [showGaneshaTransition, setShowGaneshaTransition] = useState(false);
  const [hideGaneshaTransition, setHideGaneshaTransition] = useState(false);
  const [startGuestNameAnimation, setStartGuestNameAnimation] = useState(false);
  
  const { isPlaying, toggleMusic } = useAudio();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setShowGaneshaTransition(true);
        setTimeout(() => {
          setHideGaneshaTransition(true);
          setTimeout(() => {
            setStartGuestNameAnimation(true);
          }, 200);
        }, 2000);
      }, 100);
    }
  }, [isLoading]);

  const handleOpenRSVPLocal = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowRSVP(true);
      setConfetti(false);
    }, 800);
    onOpenRSVP?.();
  };

  const handleAcceptInvitationLocal = () => {
    if (showThankYouMessage) return;
    
    setConfetti(true);
    setTimeout(() => {
      setShowThankYouMessage(true);
      setConfetti(false);
    }, 800);
    onAcceptInvitation?.();
  };

  if (isLoading) {
    return (
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
                <span className="font-great-vibes gold-highlight animate-shimmer">{guestName || "Guest"}</span>
              </span>
            </h3>
            <div className="mt-1 mx-auto w-32 h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
          </div>
          <p className="text-wedding-gold/70 text-sm md:text-base font-dancing-script">
            The celebration awaits<span className="loading-dots"></span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pattern-background">
      <main id="main-content" className="min-h-screen w-full flex flex-col relative overflow-hidden">
        
        {/* Ganesha Transition */}
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
        
        {/* Music and Navigation Controls */}
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
        </div>

        {/* Guest Name Animation */}
        {startGuestNameAnimation && guestName && (
          <AnimatedGuestName 
            name={guestName}
          />
        )}

        {/* Main Content */}
        <div className="flex-1">
          <InvitationHeader 
            groomName={weddingData.couple.groomFirstName}
            brideName={weddingData.couple.brideFirstName}
            coupleImageUrl={weddingData.couple.coupleImageUrl}
            startGuestNameAnimation={startGuestNameAnimation}
          />

          <CoupleSection />

          <CountdownTimer 
            weddingDate={weddingData.mainWedding.date}
            weddingTime={weddingData.mainWedding.time}
          />

          <FamilyDetails />

          <RomanticJourneySection />

          <EventTimeline />

          <PhotoGrid />

          {wishesEnabled && <WishesCarousel />}

          <RSVPSection />

          <Footer />
        </div>

        {/* Wishes Modal */}
        {showWishesModal && (
          <WishesModal 
            open={showWishesModal}
            onOpenChange={(open) => setShowWishesModal(open)}
          />
        )}
      </main>
    </div>
  );
};