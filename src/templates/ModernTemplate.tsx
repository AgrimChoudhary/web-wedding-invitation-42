import React, { useState, useEffect } from 'react';
import { TemplateProps } from '@/types/template';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CountdownTimer from '@/components/CountdownTimer';
import FamilyDetails from '@/components/FamilyDetails';
import EventTimeline from '@/components/EventTimeline';
import PhotoGrid from '@/components/PhotoGrid';
import WishesCarousel from '@/components/WishesCarousel';
import WishesModal from '@/components/WishesModal';
import { RSVPSection } from '@/components/RSVPSection';
import { Confetti } from '@/components/AnimatedElements';
import { Volume2, VolumeX, Heart, Calendar, MapPin, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatWeddingDate } from '@/placeholders';

export const ModernTemplate: React.FC<TemplateProps> = ({
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
  const isMobile = useIsMobile();

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-600 text-lg">Loading invitation for {guestName || "Guest"}...</p>
        </div>
      </div>
    );
  }

  const groomName = weddingData.couple.groomFirstName;
  const brideName = weddingData.couple.brideFirstName;
  const displayNames = weddingData.groomFirst ? `${groomName} & ${brideName}` : `${brideName} & ${groomName}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Confetti isActive={confetti} />
      
      {/* Music Control */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button 
          onClick={toggleMusic}
          variant="outline"
          size="icon"
          className="rounded-full bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white shadow-lg"
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-500/5 to-purple-600/5"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {guestName && (
            <div className="mb-8">
              <p className="text-slate-600 text-lg mb-2">Dear</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{guestName}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
            {displayNames}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8">
            You're invited to celebrate our wedding
          </p>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-blue-500" size={20} />
                <span className="text-slate-700 font-medium">
                  {formatWeddingDate(weddingData.mainWedding.date)}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-blue-500" size={20} />
                <span className="text-slate-700 font-medium">
                  {weddingData.mainWedding.venue.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="text-red-500" size={20} />
                <span className="text-slate-700 font-medium">
                  {weddingData.mainWedding.time}
                </span>
              </div>
            </CardContent>
          </Card>
          
          {weddingData.couple.coupleImageUrl && (
            <div className="mt-12">
              <img 
                src={weddingData.couple.coupleImageUrl}
                alt={`${groomName} and ${brideName}`}
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full mx-auto shadow-2xl border-8 border-white"
              />
            </div>
          )}
        </div>
      </section>

      {/* Countdown */}
      <section className="py-20 bg-white">
        <CountdownTimer 
          weddingDate={weddingData.mainWedding.date}
          weddingTime={weddingData.mainWedding.time}
        />
      </section>

      {/* Family Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Users className="mx-auto mb-4 text-blue-500" size={48} />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Families</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <FamilyDetails />
        </div>
      </section>

      {/* Events */}
      {weddingData.events && weddingData.events.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Calendar className="mx-auto mb-4 text-blue-500" size={48} />
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Wedding Events</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
            <EventTimeline />
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {weddingData.photoGallery && weddingData.photoGallery.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Heart className="mx-auto mb-4 text-red-500" size={48} />
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Memories</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>
            <PhotoGrid />
          </div>
        </section>
      )}

      {/* Wishes */}
      {wishesEnabled && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Heart className="mx-auto mb-4 text-pink-500" size={48} />
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Wedding Wishes</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <WishesCarousel />
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
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