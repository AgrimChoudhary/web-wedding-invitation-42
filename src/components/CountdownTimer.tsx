import React, { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, Sparkles, MapPin, Diamond, Crown, Star } from 'lucide-react';
import { FireworksDisplay } from './AnimatedElements';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  weddingDate?: Date;
  weddingTime?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDate, weddingTime }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const isMobile = useIsMobile();
  
  // Calculate wedding date - 1.5 months from now
  const getWeddingDate = () => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(now.getMonth() + 1);
    futureDate.setDate(now.getDate() + 15); // Add 15 days to make it 1.5 months
    futureDate.setHours(20, 0, 0, 0); // 8:00 PM
    return futureDate;
  };
  
  const targetDate = weddingDate ? weddingDate.getTime() : getWeddingDate().getTime();
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Animation trigger
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('countdown-timer');
    if (element) observer.observe(element);
    
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [targetDate]);
  
  useEffect(() => {
    if (showFireworks) {
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showFireworks]);
  
  const handleTimerClick = () => {
    setShowFireworks(true);
  };
  
  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: Calendar, gradient: 'from-wedding-cream via-wedding-blush/50 to-wedding-gold/70' },
    { label: 'Hours', value: timeLeft.hours, icon: Clock, gradient: 'from-wedding-gold/60 via-wedding-cream to-wedding-blush/50' },
    { label: 'Minutes', value: timeLeft.minutes, icon: Diamond, gradient: 'from-wedding-blush/50 via-wedding-gold/60 to-wedding-cream' },
    { label: 'Seconds', value: timeLeft.seconds, icon: Sparkles, gradient: 'from-wedding-cream via-wedding-gold/50 to-wedding-blush/60' }
  ];

  // Format date and time for display
  const displayDate = weddingDate ? 
    weddingDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : getWeddingDate().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
  const displayTime = weddingTime || '8:00 PM';

  return (
    <section id="countdown-timer" className="w-full py-8 md:py-12 relative overflow-hidden bg-gradient-to-br from-wedding-cream to-wedding-ivory">
      {/* Decorative elements with lighter colors */}
      <div className="absolute inset-0 bg-floral-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-2 h-2 bg-wedding-gold/40 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-wedding-maroon/30 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-wedding-blush/60 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-wedding-gold/40 rounded-full animate-pulse opacity-25"></div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 py-2 px-6 bg-white/60 rounded-full border border-wedding-gold/15 backdrop-blur-sm mb-4">
            <Crown size={16} className="text-wedding-gold/80" />
            <span className="text-sm md:text-base text-wedding-maroon/80 font-medium tracking-wide font-dancing-script">Save The Date</span>
            <Crown size={16} className="text-wedding-gold/80" />
          </div>
          
          <h3 className="font-great-vibes text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-wedding-maroon/90 mb-2">
            Countdown to Forever
          </h3>
          <p className="text-wedding-maroon/70 font-medium text-sm md:text-base font-dancing-script">Our wedding celebration begins in</p>
        </div>
        
        <div 
          className={`relative glass-card p-6 md:p-8 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} cursor-pointer group hover:shadow-gold-glow border border-wedding-gold/10 bg-white/40`}
          onClick={handleTimerClick}
          title="Click for a magical surprise! ✨"
        >
          {/* Lighter luxury border decoration */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-wedding-gold/10 via-wedding-blush/10 to-wedding-gold/10 blur-xl"></div>
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-wedding-gold/20 via-wedding-maroon/15 to-wedding-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {timeUnits.map((unit, index) => {
                const IconComponent = unit.icon;
                return (
                  <div 
                    key={index} 
                    className={`text-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} group/card`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative">
                      {/* Main countdown card with lighter colors */}
                      <div className={`${isMobile ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-28 h-28 md:w-32 md:h-32'} mx-auto rounded-2xl bg-gradient-to-br ${unit.gradient} flex items-center justify-center shadow-lg relative overflow-hidden group-hover/card:scale-105 transition-all duration-500 border border-wedding-gold/20`}>
                        {/* Animated background with lighter tones */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-black/5 to-transparent"></div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Time value */}
                        <span className={`font-bold ${isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl'} text-wedding-maroon/90 relative z-10 drop-shadow-sm`}>
                          {unit.value < 10 ? `0${unit.value}` : unit.value}
                        </span>
                        
                        {/* Corner decorations with lighter colors */}
                        <div className="absolute top-2 left-2">
                          <IconComponent size={14} className="text-background drop-shadow-md" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg"></div>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <div className="w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg"></div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="w-3 h-3 border-b-2 border-r-2 border-white/30 rounded-br-lg"></div>
                        </div>
                      </div>
                      
                      {/* Floating icon with lighter colors */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-wedding-gold/80 to-wedding-gold/60 rounded-full flex items-center justify-center shadow-md group-hover/card:animate-bounce">
                        <IconComponent size={14} className="text-background drop-shadow-md" />
                      </div>
                      
                      {/* Label */}
                      <p className={`mt-4 ${isMobile ? 'text-sm sm:text-base' : 'text-base md:text-lg'} text-wedding-maroon/80 font-semibold font-dancing-script tracking-wide`}>
                        {unit.label}
                      </p>
                      
                      {/* Subtle glow effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${unit.gradient} opacity-0 group-hover/card:opacity-15 transition-opacity duration-500 blur-xl`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Wedding date and time display with lighter colors */}
            <div className="text-center mt-8 md:mt-10">
              <div className="inline-flex items-center gap-3 bg-white/60 px-6 py-4 rounded-2xl shadow-md border border-wedding-gold/15 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-wedding-gold/80 to-wedding-gold/60 rounded-full flex items-center justify-center">
                    <Calendar size={18} className="text-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-wedding-maroon/90 text-sm md:text-base font-playfair">{displayDate}</p>
                    <p className="text-wedding-maroon/70 text-xs md:text-sm flex items-center gap-1 font-dancing-script">
                      <Clock size={12} />
                      {displayTime}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-wedding-gold/15"></div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-wedding-gold/80 fill-wedding-gold/80" />
                  <Sparkles size={14} className="text-wedding-maroon/70 animate-pulse" />
                  <Heart size={14} className="text-wedding-blush/80 fill-wedding-blush/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
            
            {/* Interactive hint with lighter text */}
            <p className="text-center text-xs text-wedding-maroon/50 mt-6 animate-pulse font-medium font-dancing-script">
              ✨ Click anywhere for a magical surprise ✨
            </p>
          </div>
        </div>
      </div>
      
      {/* Fireworks animation */}
      <FireworksDisplay isActive={showFireworks} />
    </section>
  );
};

export default CountdownTimer;
