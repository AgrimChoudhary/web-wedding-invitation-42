import React, { useState, useEffect } from 'react';
import { useGuest } from '../context/GuestContext';
import { useWedding } from '../context/WeddingContext';
import { FallingHearts, FireworksDisplay } from './AnimatedElements';
import { Star, Music, Heart, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedGuestName from './AnimatedGuestName';
import OptimizedImage from './OptimizedImage';
import { GaneshaImageSkeleton, CoupleImageSkeleton } from './ImageSkeleton';
import { useCriticalWeddingImages } from '@/hooks/useAdvancedImagePreloader';

interface InvitationHeaderProps {
  brideName?: string;
  groomName?: string;
  coupleImageUrl?: string;
  startGuestNameAnimation?: boolean;
}

const InvitationHeader: React.FC<InvitationHeaderProps> = ({ 
  brideName, 
  groomName,
  coupleImageUrl,
  startGuestNameAnimation = false
}) => {
  const { guestName, guestId } = useGuest();
  const { weddingData } = useWedding();
  const [showHearts, setShowHearts] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showGaneshaImage, setShowGaneshaImage] = useState(false);
  const isMobile = useIsMobile();

  // Critical image URLs
  const ganeshaImageUrl = "https://xieiyoyiuhzrhwqhfmuq.supabase.co/storage/v1/object/public/images/for%20links%20only/b0b6e6c1-770d-4a6e-8f9c-7f3bdcd7c3a4.png";
  const couplePhotoUrl = "https://xieiyoyiuhzrhwqhfmuq.supabase.co/storage/v1/object/public/images/for%20links%20only/f002c96a-d091-4373-9cc7-72487af38606.png";
  
  // Initialize critical image preloading
  const { getImageState, isLoading: imagesLoading } = useCriticalWeddingImages(
    ganeshaImageUrl,
    couplePhotoUrl,
    [],
    []
  );

  const ganeshaImageState = getImageState(ganeshaImageUrl);
  const coupleImageState = getImageState(couplePhotoUrl);
  
  // Use names from props if provided, otherwise use from weddingData
  const displayGroomName = groomName || weddingData.couple.groomFirstName;
  const displayBrideName = brideName || weddingData.couple.brideFirstName;
  
  // Determine order based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? displayGroomName : displayBrideName;
  const secondPersonName = weddingData.groomFirst ? displayBrideName : displayGroomName;
  
  const triggerMagicalSurprise = () => {
    setIsClicked(true);
    setClickCount(prev => prev + 1);
    
    // Create a spectacular sequence of effects
    // 1. Start with confetti burst
    setShowConfetti(true);
    
    // 2. Add hearts after 600ms
    setTimeout(() => {
      setShowHearts(true);
    }, 600);
    
    // 3. Add fireworks after 1000ms
    setTimeout(() => {
      setShowFireworks(true);
    }, 1000);
    
    // 4. Add second wave of effects for multiple clicks
    if (clickCount > 0) {
      setTimeout(() => {
        setShowConfetti(true);
        setShowFireworks(true);
      }, 1500);
    }
    
    // Reset confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Reset hearts after 5 seconds
    setTimeout(() => setShowHearts(false), 5000);
    
    // Reset fireworks after 4 seconds
    setTimeout(() => setShowFireworks(false), 4000);
    
    // Reset click state after all effects
    setTimeout(() => {
      setIsClicked(false);
    }, 6000);
  };
  
  useEffect(() => {
    // Show Ganesha image after the transition animation completes
    // This creates the effect of the image moving into position
    const ganeshaImageTimer = setTimeout(() => {
      setShowGaneshaImage(true);
    }, 4500); // 4.5s to ensure transition is fully complete
    
    // Auto-play visual effects on load for a more immersive experience
    const initialTimer = setTimeout(() => {
      setShowHearts(true);
      setTimeout(() => {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
      }, 1500);
      setTimeout(() => setShowHearts(false), 3000);
    }, 6000); // Delay initial effects until after Ganesha appears
    
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
    
    return () => {
      clearTimeout(ganeshaImageTimer);
      clearTimeout(initialTimer);
    };
  }, [guestId, weddingData.events]);

  return (
    <header className="relative w-full flex flex-col items-center pt-6 pb-4 sm:pt-8 sm:pb-6 overflow-hidden">
      <div className="w-full max-w-4xl px-4">
        {/* Enhanced Ganesha Section - Frame always visible, image appears after transition */}
        <div className="flex flex-col items-center mb-10 sm:mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Religious Card with Ganesha */}
          <div className="relative group">
            {/* Multiple glowing layers */}
            <div className="absolute -inset-6 bg-gradient-to-r from-orange-400/20 via-yellow-400/30 to-red-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-1000 animate-pulse-soft"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-300/30 via-yellow-300/40 to-orange-300/30 rounded-full blur-lg transition-all duration-700"></div>
            
            {/* Main divine card - Always visible */}
            <div className="relative luxury-frame bg-gradient-to-br from-orange-50/90 via-yellow-50/95 to-orange-50/90 backdrop-blur-lg rounded-full p-8 sm:p-10 divine-glow">
              {/* Sacred geometric pattern */}
              <div className="absolute inset-4 rounded-full border-2 border-orange-200/60 animate-pulse-soft" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-6 rounded-full border border-yellow-300/40 animate-pulse-soft" style={{animationDelay: '1s'}}></div>
              
              {/* Floating Om symbols */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-orange-400/40 rounded-full flex items-center justify-center animate-float text-orange-600" style={{animationDelay: '0s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              <div className="absolute -top-4 -right-2 w-5 h-5 bg-yellow-400/50 rounded-full flex items-center justify-center animate-float text-yellow-700" style={{animationDelay: '1s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-red-400/40 rounded-full flex items-center justify-center animate-float text-red-600" style={{animationDelay: '2s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              <div className="absolute -bottom-4 -right-3 w-6 h-6 bg-orange-300/50 rounded-full flex items-center justify-center animate-float text-orange-600" style={{animationDelay: '1.5s'}}>
                <span className="text-xs">ॐ</span>
              </div>
              
              {/* Ganesha Image container - Frame always visible, image shows after transition */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-yellow-200/30 to-orange-200/20 rounded-full animate-pulse-soft blur-sm"></div>
                
                {/* Show skeleton while loading */}
                {(!showGaneshaImage || !ganeshaImageState?.isLoaded) && (
                  <GaneshaImageSkeleton className="absolute inset-0" />
                )}
                
                {/* Only show the image after transition completes */}
                {showGaneshaImage && (
                  <OptimizedImage
                    src={ganeshaImageUrl}
                    alt="Lord Ganesha"
                    className="w-full h-full object-contain animate-floating relative z-10 opacity-0 animate-fade-in"
                    priority="critical"
                    enableBlurTransition={true}
                    style={{ animationDelay: '0.2s' }}
                  />
                )}
                
                {/* Enhanced decorative elements - Always visible */}
                <Star 
                  size={16} 
                  className="absolute -top-3 -left-3 text-orange-400 animate-pulse-soft" 
                  fill="#FB923C" 
                  style={{animationDelay: '0.2s'}}
                />
                <Crown 
                  size={14} 
                  className="absolute -top-2 -right-4 text-yellow-500 animate-pulse-soft" 
                  fill="#EAB308" 
                  style={{animationDelay: '0.8s'}}
                />
                <Heart 
                  size={18} 
                  className="absolute -bottom-2 -left-4 text-red-400 animate-pulse-soft" 
                  fill="#F87171" 
                  style={{animationDelay: '0.2s'}}
                />
                <Star 
                  size={15} 
                  className="absolute -bottom-3 -right-3 text-orange-300 animate-pulse-soft" 
                  fill="#FDBA74" 
                  style={{animationDelay: '0.2s'}}
                />
              </div>
            </div>
          </div>
          
          {/* Enhanced Sanskrit Shloka */}
          <div className="text-center mt-6 relative max-w-md">
            {/* Decorative line above */}
            <div className="mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent blur-sm"></div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50/60 to-yellow-50/60 backdrop-blur-sm rounded-lg p-4 border border-orange-200/30">
              <p className="font-hindi text-base sm:text-lg text-orange-800 mb-2 leading-relaxed font-medium">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
              </p>
              <p className="font-hindi text-base sm:text-lg text-orange-800 leading-relaxed font-medium">
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
              </p>
            </div>
            
            {/* Decorative line below */}
            <div className="mx-auto w-32 h-[2px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent mt-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent blur-sm"></div>
            </div>
            
            {/* Translation */}
            <p className="text-sm sm:text-base text-orange-700/90 mt-3 italic font-medium">
              "O Lord Ganesha, please remove all obstacles from our path"
            </p>
          </div>
        </div>
        
        {/* Refined Guest Welcome Section */}
        <div className="text-center mb-8 sm:mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="relative">
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-wedding-gold/10 via-wedding-blush/10 to-wedding-gold/10 rounded-2xl blur-lg"></div>
            
            <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-wedding-gold/20">
              <h1 className="font-great-vibes text-4xl sm:text-5xl md:text-6xl text-wedding-maroon mb-4">
                Welcome{' '}
                <span className="text-wedding-gold">
                  {startGuestNameAnimation ? (
                    <AnimatedGuestName 
                      name={guestName} 
                      fallback="Dear Guest"
                      animationType="typing"
                      className="font-great-vibes"
                      delay={0}
                    />
                  ) : (
                    <span className="font-great-vibes">{guestName || "Dear Guest"}</span>
                  )}
                </span>
              </h1>
              
              <h2 className="font-dancing-script text-xl sm:text-2xl text-wedding-gold/90 mt-2">
                You are cordially invited to our celebration!
              </h2>
              
              {/* Simple decorative line */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-[1px] w-16 bg-wedding-gold/50"></div>
                <Heart size={12} className="text-wedding-gold/60" fill="currentColor" />
                <div className="h-[1px] w-16 bg-wedding-gold/50"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Magical Couple Section */}
        <div 
          className={`text-center relative opacity-0 animate-fade-in-up cursor-pointer transform transition-all duration-500 ${
            isClicked ? 'scale-105' : 'hover:scale-102'
          }`}
          style={{ animationDelay: '0.9s' }}
          onClick={triggerMagicalSurprise}
          title="Click for a magical surprise!"
        >
          <div className="flex flex-col items-center">
            {/* Couple Image with Enhanced Magical Frame */}
            <div className="relative mb-6 sm:mb-8">
              {/* Enhanced magical glow effect */}
              <div className={`absolute -inset-3 bg-gradient-to-r from-wedding-gold/20 via-wedding-blush/20 to-wedding-gold/20 rounded-full blur-lg transition-all duration-700 ${
                isClicked ? 'animate-pulse scale-110' : ''
              }`}></div>
              
              {/* Show skeleton while loading */}
              {!coupleImageState?.isLoaded && (
                <CoupleImageSkeleton className="relative bg-white/30 backdrop-blur-sm rounded-full p-3 border border-wedding-gold/30" />
              )}
              
              <div className={`relative bg-white/30 backdrop-blur-sm rounded-full p-3 border border-wedding-gold/30 transition-all duration-500 ${
                isClicked ? 'shadow-2xl border-wedding-gold/60' : ''
              } ${!coupleImageState?.isLoaded ? 'opacity-0' : 'opacity-100'}`}>
                <OptimizedImage
                  src={couplePhotoUrl}
                  alt={`${firstPersonName} and ${secondPersonName}`}
                  className={`w-44 h-auto sm:w-52 md:w-60 lg:w-72 object-contain relative z-10 transition-all duration-500 ${
                    isClicked ? 'brightness-110 contrast-110' : ''
                  }`}
                  priority="critical"
                  enableBlurTransition={true}
                />
              </div>
            </div>
            
            {/* Enhanced Couple Names with magical effects */}
            <div className="mt-4">
              <h2 className={`font-great-vibes text-5xl sm:text-6xl md:text-7xl text-wedding-maroon leading-tight mb-4 transition-all duration-500 ${
                isClicked ? 'text-shadow-lg' : ''
              }`}>
                <span className="inline-block">
                  {firstPersonName}
                </span>
                
                <span className={`inline-block mx-4 text-wedding-gold text-4xl sm:text-5xl md:text-6xl transition-all duration-500 ${
                  isClicked ? 'animate-pulse scale-110' : ''
                }`}>
                  &
                </span>
                
                <span className="inline-block">
                  {secondPersonName}
                </span>
              </h2>
              
              <div className="text-center text-base sm:text-lg text-wedding-gold/90 font-dancing-script tracking-wider uppercase">
                Wedding Invitation
              </div>
            </div>
            
            {/* Enhanced Decorative Divider */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-20 sm:w-24 bg-wedding-gold/60"></div>
              <div className={`w-2 h-2 rounded-full bg-wedding-gold/50 transition-all duration-500 ${
                isClicked ? 'animate-ping scale-150' : ''
              }`}></div>
              <div className="h-[1px] w-20 sm:w-24 bg-wedding-gold/60"></div>
            </div>
            
            <p className={`text-sm text-gray-500 mt-6 font-medium transition-all duration-300 ${
              isClicked ? 'text-wedding-gold animate-bounce' : ''
            }`}>
              {isClicked ? '✨ Magical! Click again for more surprises! ✨' : 'Click for a magical surprise ✨'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Animation Components */}
      <FallingHearts isActive={showHearts} />
      <FireworksDisplay isActive={showFireworks} />
      
      {/* New Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
          {Array.from({ length: isMobile ? 40 : 60 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-fall-confetti"
              style={{
                left: `${Math.random() * 100}vw`,
                top: '-10px',
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default InvitationHeader;