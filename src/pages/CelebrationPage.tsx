import React, { useState, useEffect } from 'react';
import { Sparkles, Camera, Heart, Gift } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import NavigationBar from '@/components/NavigationBar';
import PhotoGrid from '@/components/PhotoGrid';
import WishesCarousel from '@/components/WishesCarousel';
import WishesModal from '@/components/WishesModal';
import { RSVPSection } from '@/components/RSVPSection';
import Footer from '@/components/Footer';
import { Confetti, FireworksDisplay } from '@/components/AnimatedElements';
import { Button } from '@/components/ui/button';
import { useGuest } from '@/context/GuestContext';
import { usePlatform } from '@/context/PlatformContext';

const CelebrationPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWishesModal, setShowWishesModal] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const { guestName, updateGuestStatus, hasAccepted } = useGuest();
  const { wishesEnabled, rsvpConfig, guestStatus, showEditButton } = usePlatform();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-show Thank You in simple mode if guest already accepted
  useEffect(() => {
    if (rsvpConfig === 'simple' && guestStatus === 'accepted') {
      setShowThankYouMessage(true);
    }
  }, [rsvpConfig, guestStatus]);

  // Auto-show Thank You in detailed mode if Edit button is OFF and user has submitted
  useEffect(() => {
    if (rsvpConfig === 'detailed' && !showEditButton && guestStatus === 'submitted') {
      setShowThankYouMessage(true);
    }
  }, [rsvpConfig, showEditButton, guestStatus]);

  const handleOpenRSVP = () => {
    setConfetti(true);
    setTimeout(() => {
      setShowRSVP(true);
      setConfetti(false);
    }, 800);
  };

  const handleAcceptInvitation = () => {
    if (showThankYouMessage) return;
    
    setConfetti(true);
    
    try {
      updateGuestStatus('accepted');
      setTimeout(() => {
        setShowThankYouMessage(true);
        setConfetti(false);
        // Show fireworks after RSVP
        setTimeout(() => {
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 5000);
        }, 1000);
      }, 800);
    } catch (error) {
      setTimeout(() => {
        setShowThankYouMessage(true);
        setConfetti(false);
      }, 800);
    }
  };

  return (
    <PageWrapper pageNumber={5} totalPages={5}>
      <Confetti isActive={confetti} />
      <FireworksDisplay isActive={showFireworks} />
      
      <div className={`w-full min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Celebration Header Section */}
        <div className="w-full py-16 bg-gradient-to-br from-purple-50/60 via-pink-50/20 to-wedding-cream/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-purple-400/5"></div>
          
          {/* Celebratory decorations */}
          <div className="absolute top-20 left-20 w-5 h-5 text-purple-300/40 animate-pulse">
            <Sparkles className="w-full h-full" />
          </div>
          <div className="absolute bottom-24 right-24 w-6 h-6 text-pink-300/40 animate-pulse" style={{ animationDelay: '1s' }}>
            <Gift className="w-full h-full" />
          </div>
          <div className="absolute top-32 right-32 w-4 h-4 text-purple-400/40 animate-pulse" style={{ animationDelay: '2s' }}>
            <Heart className="w-full h-full fill-current" />
          </div>
          
          <div className="w-full max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles size={28} className="text-purple-400 animate-pulse" />
              <span className="inline-block py-3 px-8 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full text-lg font-semibold text-wedding-maroon border border-purple-300/30 tracking-wider shadow-lg">
                Grand Celebration
              </span>
              <Sparkles size={28} className="text-purple-400 animate-pulse" />
            </div>
            
            <h1 className="font-great-vibes text-5xl md:text-6xl text-wedding-maroon mb-6 drop-shadow-lg">
              Blessings & Celebration
            </h1>
            
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg mb-8">
              Celebrate with us through cherished memories, heartfelt wishes, and your gracious presence. Your blessings and love make this journey complete and our celebration truly magical.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-purple-400/60 to-purple-400"></div>
              <Camera size={16} className="text-purple-400 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-purple-400/60 animate-pulse"></div>
              <Gift size={16} className="text-purple-400 animate-pulse" />
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-purple-400/60 to-purple-400"></div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="bg-wedding-cream/20 py-12">
          <PhotoGrid title="Cherished Memories" />
        </div>

        {/* Wishes Section */}
        {wishesEnabled && (
          <div className="bg-gradient-to-br from-wedding-cream/30 via-pink-50/20 to-wedding-cream/30 py-12">
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-3">Heartfelt Wishes</h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Share your blessings and warm wishes for our new journey together
                </p>
                <Button
                  onClick={() => setShowWishesModal(true)}
                  className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Heart size={18} className="mr-2 fill-current" />
                  Send Your Wishes
                </Button>
              </div>
              <WishesCarousel />
            </div>
          </div>
        )}

        {/* RSVP Section */}
        <div className="bg-gradient-to-br from-wedding-cream/40 via-wedding-blush/10 to-wedding-cream/40 py-16">
          <div className="w-full max-w-4xl mx-auto px-4">
            {showThankYouMessage ? (
              <div className="text-center space-y-6">
                <div className="inline-block p-8 bg-gradient-to-br from-green-50 to-green-100/80 rounded-3xl border border-green-200 shadow-xl">
                  <div className="mb-4">
                    <Sparkles size={48} className="text-green-500 mx-auto animate-pulse" />
                  </div>
                  <h3 className="font-great-vibes text-3xl md:text-4xl text-green-700 mb-4">
                    Thank You, {guestName}!
                  </h3>
                  <p className="text-green-600 text-lg leading-relaxed max-w-lg mx-auto">
                    Your presence will make our celebration truly special. We can't wait to celebrate this joyous occasion with you!
                  </p>
                </div>
              </div>
            ) : (
              <RSVPSection />
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />

      </div>

      {/* Wishes Modal */}
      {wishesEnabled && (
        <WishesModal 
          open={showWishesModal} 
          onOpenChange={setShowWishesModal} 
        />
      )}

      <NavigationBar currentPage={5} totalPages={5} />
    </PageWrapper>
  );
};

export default CelebrationPage;