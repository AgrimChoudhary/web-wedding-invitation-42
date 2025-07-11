import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWedding } from '@/context/WeddingContext';

const RomanticJourneySection: React.FC = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [heartsVisible, setHeartsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [sparklesVisible, setSparklesVisible] = useState(false);
  const isMobile = useIsMobile();
  const { weddingData } = useWedding();

  // Determine which name to show first based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? weddingData.couple.groomFirstName : weddingData.couple.brideFirstName;
  const secondPersonName = weddingData.groomFirst ? weddingData.couple.brideFirstName : weddingData.couple.groomFirstName;
  
  const firstPersonCity = weddingData.groomFirst ? weddingData.couple.groomCity : weddingData.couple.brideCity;
  const secondPersonCity = weddingData.groomFirst ? weddingData.couple.brideCity : weddingData.couple.groomCity;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationStarted) {
          setAnimationStarted(true);
          setHeartsVisible(true);
          
          // Show text when hearts meet
          setTimeout(() => {
            setTextVisible(true);
          }, 2500);
          
          // Show sparkles after text
          setTimeout(() => {
            setSparklesVisible(true);
          }, 3000);
          
          // Reset animation for loop
          setTimeout(() => {
            setHeartsVisible(false);
            setTextVisible(false);
            setSparklesVisible(false);
            setTimeout(() => {
              setAnimationStarted(false);
            }, 1000);
          }, 6000);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('romantic-journey');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [animationStarted]);

  // Restart animation every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!animationStarted) {
        setAnimationStarted(true);
        setHeartsVisible(true);
        
        setTimeout(() => setTextVisible(true), 2500);
        setTimeout(() => setSparklesVisible(true), 3000);
        
        setTimeout(() => {
          setHeartsVisible(false);
          setTextVisible(false);
          setSparklesVisible(false);
          setTimeout(() => setAnimationStarted(false), 1000);
        }, 6000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [animationStarted]);

  return (
    <section id="romantic-journey" className="w-full py-12 md:py-16 relative overflow-hidden bg-gradient-to-br from-wedding-cream via-wedding-blush/8 to-wedding-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-floral-pattern opacity-15"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-wedding-blush/40 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-16 w-2 h-2 bg-wedding-gold/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-32 right-12 w-3 h-3 bg-wedding-blush/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-great-vibes text-4xl md:text-6xl lg:text-7xl text-wedding-maroon mb-4">
            Dil se Dil tak...
          </h2>
          <p className="font-dancing-script text-lg md:text-xl text-wedding-maroon/80 mb-2">
            A Beautiful Journey of Love
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto"></div>
        </div>

        {/* Animation Container */}
        <div className="relative h-72 md:h-96 lg:h-[26rem] flex items-center justify-center">
          {/* Desktop Layout */}
          {!isMobile && (
            <>
              {/* Curved Path SVG for Desktop */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 800 400" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#EF4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  d="M 60 200 Q 200 100 400 200 Q 600 300 740 200"
                  stroke="url(#pathGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
              </svg>

              {/* City Labels for Desktop */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full border-2 border-red-200 shadow-lg">
                  <MapPin size={18} className="text-red-600" />
                  <span className="text-base font-dancing-script text-red-700 font-semibold">
                    {firstPersonName} - {firstPersonCity || "Jaipur"}
                  </span>
                </div>
              </div>

              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full border-2 border-red-200 shadow-lg">
                  <MapPin size={18} className="text-red-600" />
                  <span className="text-base font-dancing-script text-red-700 font-semibold">
                    {secondPersonName} - {secondPersonCity || "Delhi"}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Mobile Layout - Improved */}
          {isMobile && (
            <>
              {/* Diagonal Path SVG for Mobile - Larger and Better Positioned */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 320 400" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="pathGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
                    <stop offset="25%" stopColor="#EF4444" stopOpacity="1" />
                    <stop offset="50%" stopColor="#F87171" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#EF4444" stopOpacity="1" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path
                  d="M 40 60 Q 80 100 120 140 Q 160 180 200 220 Q 240 260 280 300 Q 300 340 310 380"
                  stroke="url(#pathGradientMobile)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="15,8"
                  className="animate-pulse"
                />
              </svg>

              {/* City Labels for Mobile - Better Positioned */}
              <div className="absolute top-6 left-4">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-full border-2 border-red-200 shadow-lg">
                  <MapPin size={16} className="text-red-600" />
                  <span className="text-sm font-dancing-script text-red-700 font-semibold">
                    {firstPersonName} - {firstPersonCity || "Jaipur"}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-6 right-4">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2.5 rounded-full border-2 border-red-200 shadow-lg">
                  <MapPin size={16} className="text-red-600" />
                  <span className="text-sm font-dancing-script text-red-700 font-semibold">
                    {secondPersonName} - {secondPersonCity || "Delhi"}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Animated Hearts */}
          {heartsVisible && (
            <>
              {/* First Person's Heart */}
              <div 
                className={`absolute w-8 h-8 md:w-12 md:h-12 ${
                  isMobile 
                    ? 'top-10 left-10' 
                    : 'left-16 top-1/2 transform -translate-y-1/2'
                }`}
                style={{
                  animation: isMobile 
                    ? 'heart-journey-mobile-left 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                    : 'heart-journey-left 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Heart size={isMobile ? 16 : 24} className="text-white fill-white" />
                </div>
              </div>

              {/* Second Person's Heart */}
              <div 
                className={`absolute w-8 h-8 md:w-12 md:h-12 ${
                  isMobile 
                    ? 'bottom-10 right-10' 
                    : 'right-16 top-1/2 transform -translate-y-1/2'
                }`}
                style={{
                  animation: isMobile 
                    ? 'heart-journey-mobile-right 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                    : 'heart-journey-right 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Heart size={isMobile ? 16 : 24} className="text-white fill-white" />
                </div>
              </div>
            </>
          )}

          {/* Center Glow Effect */}
          {textVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-300/50 to-pink-300/50 rounded-full animate-pulse blur-xl"></div>
            </div>
          )}

          {/* Center Text - Improved Mobile Positioning */}
          {textVisible && (
            <div className={`absolute z-20 ${
              isMobile 
                ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                : 'inset-0 flex items-center justify-center'
            }`}>
              <div className="text-center transform animate-scale-in">
                <div className="bg-gradient-to-br from-white/98 to-red-50/95 backdrop-blur-md px-3 py-2 md:px-5 md:py-3 rounded-xl border-2 border-red-200 shadow-xl">
                  <h3 className="font-great-vibes text-base md:text-xl text-red-700 mb-1">
                    Dil se Dil tak... 💖
                  </h3>
                  <p className="font-dancing-script text-xs md:text-sm text-red-600/80">
                    Two hearts, one love story
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sparkles */}
          {sparklesVisible && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={isMobile ? 12 : 14}
                  className="absolute text-red-500 animate-sparkle"
                  style={{
                    left: `${25 + Math.random() * 50}%`,
                    top: `${25 + Math.random() * 50}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom keyframes styles */}
      <style>{`
        @keyframes heart-journey-left {
          0% {
            left: 4rem;
            top: 50%;
            transform: translateY(-50%) scale(1);
          }
          50% {
            left: 45%;
            top: 35%;
            transform: translateY(-50%) scale(1.2);
          }
          100% {
            left: 50%;
            top: 50%;
            transform: translateY(-50%) scale(1.4);
          }
        }

        @keyframes heart-journey-right {
          0% {
            right: 4rem;
            top: 50%;
            transform: translateY(-50%) scale(1);
          }
          50% {
            right: 45%;
            top: 65%;
            transform: translateY(-50%) scale(1.2);
          }
          100% {
            right: 50%;
            top: 50%;
            transform: translateY(-50%) scale(1.4);
          }
        }

        @keyframes heart-journey-mobile-left {
          0% {
            top: 2.5rem;
            left: 2.5rem;
            transform: scale(1);
          }
          30% {
            top: 30%;
            left: 30%;
            transform: scale(1.1);
          }
          60% {
            top: 45%;
            left: 45%;
            transform: scale(1.2);
          }
          100% {
            top: 50%;
            left: 50%;
            transform: scale(1.3);
          }
        }

        @keyframes heart-journey-mobile-right {
          0% {
            bottom: 2.5rem;
            right: 2.5rem;
            transform: scale(1);
          }
          30% {
            bottom: 30%;
            right: 30%;
            transform: scale(1.1);
          }
          60% {
            bottom: 45%;
            right: 45%;
            transform: scale(1.2);
          }
          100% {
            bottom: 50%;
            right: 50%;
            transform: scale(1.3);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default RomanticJourneySection;