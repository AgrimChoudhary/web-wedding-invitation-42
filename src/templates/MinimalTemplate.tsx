import React, { useState } from 'react';
import { TemplateProps } from '@/types/template';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FamilyDetails from '@/components/FamilyDetails';
import EventTimeline from '@/components/EventTimeline';
import PhotoGrid from '@/components/PhotoGrid';
import WishesCarousel from '@/components/WishesCarousel';
import WishesModal from '@/components/WishesModal';
import { RSVPSection } from '@/components/RSVPSection';
import { Confetti } from '@/components/AnimatedElements';
import { Volume2, VolumeX, Heart } from 'lucide-react';
import { formatWeddingDate } from '@/placeholders';

export const MinimalTemplate: React.FC<TemplateProps> = ({
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
  
  const { isPlaying, toggleMusic } = useAudio();

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const groomName = weddingData.couple.groomFirstName;
  const brideName = weddingData.couple.brideFirstName;
  const displayNames = weddingData.groomFirst ? `${groomName} & ${brideName}` : `${brideName} & ${groomName}`;

  return (
    <div className="min-h-screen bg-white">
      <Confetti isActive={confetti} />
      
      {/* Music Control */}
      <div className="fixed top-6 right-6 z-30">
        <Button 
          onClick={toggleMusic}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {guestName && (
            <p className="text-gray-600 mb-8 text-lg">Dear {guestName},</p>
          )}
          
          <h1 className="text-6xl md:text-8xl font-light text-black mb-8 tracking-wide">
            {displayNames}
          </h1>
          
          <div className="w-32 h-px bg-black mx-auto mb-8"></div>
          
          <p className="text-gray-600 text-xl mb-12">
            {formatWeddingDate(weddingData.mainWedding.date)}
          </p>
          
          <p className="text-gray-600 text-lg mb-4">
            {weddingData.mainWedding.venue.name}
          </p>
          
          <p className="text-gray-600">
            {weddingData.mainWedding.venue.address}
          </p>
          
          {weddingData.couple.coupleImageUrl && (
            <div className="mt-16">
              <img 
                src={weddingData.couple.coupleImageUrl}
                alt={`${groomName} and ${brideName}`}
                className="w-64 h-64 object-cover mx-auto grayscale"
              />
            </div>
          )}
        </div>
      </section>

      {/* Family Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Families</h2>
          <FamilyDetails />
        </div>
      </section>

      {/* Events */}
      {weddingData.events && weddingData.events.length > 0 && (
        <section className="py-20 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Events</h2>
            <EventTimeline />
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {weddingData.photoGallery && weddingData.photoGallery.length > 0 && (
        <section className="py-20 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Gallery</h2>
            <PhotoGrid />
          </div>
        </section>
      )}

      {/* Wishes */}
      {wishesEnabled && (
        <section className="py-20 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Wishes</h2>
            <WishesCarousel />
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-20 border-t border-gray-200 bg-gray-50">
        <RSVPSection />
      </section>

      {/* Wishes Modal */}
      {showWishesModal && (
        <WishesModal 
          open={showWishesModal}
          onOpenChange={(open) => setShowWishesModal(open)}
        />
      )}
    </div>
  );
};