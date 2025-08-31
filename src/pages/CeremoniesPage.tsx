import React, { useState, useEffect } from 'react';
import { Crown, Calendar, Clock } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import NavigationBar from '@/components/NavigationBar';
import EventTimeline from '@/components/EventTimeline';
import CountdownTimer from '@/components/CountdownTimer';
import { useWedding } from '@/context/WeddingContext';
import { formatWeddingDate } from '@/placeholders';

const CeremoniesPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { weddingData } = useWedding();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper pageNumber={4} totalPages={5}>
      <div className={`w-full min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Sacred Header Section */}
        <div className="w-full py-16 bg-gradient-to-br from-orange-50/60 via-yellow-50/20 to-wedding-cream/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-orange-400/5"></div>
          
          {/* Temple-style decorations */}
          <div className="absolute top-20 left-20 w-6 h-6 text-wedding-gold/30 animate-pulse">
            <Crown className="w-full h-full" />
          </div>
          <div className="absolute bottom-24 right-24 w-8 h-8 text-wedding-gold/40 animate-pulse" style={{ animationDelay: '1s' }}>
            <Crown className="w-full h-full" />
          </div>
          <div className="absolute top-32 right-32 w-4 h-4 text-wedding-gold/35 animate-pulse" style={{ animationDelay: '2s' }}>
            <Crown className="w-full h-full" />
          </div>
          
          <div className="w-full max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown size={28} className="text-wedding-gold animate-pulse" />
              <span className="inline-block py-3 px-8 bg-gradient-to-r from-wedding-gold/20 to-orange-200/30 rounded-full text-lg font-semibold text-wedding-maroon border border-wedding-gold/30 tracking-wider shadow-lg">
                Sacred Ceremonies
              </span>
              <Crown size={28} className="text-wedding-gold animate-pulse" />
            </div>
            
            <h1 className="font-great-vibes text-5xl md:text-6xl text-wedding-maroon mb-6 drop-shadow-lg">
              Divine Celebrations
            </h1>
            
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg mb-8">
              Join us in the sacred ceremonies that will unite two souls in eternal matrimony. Each ritual is a blessing, each moment a celebration of love, tradition, and divine grace.
            </p>
            
            {/* Wedding Date and Time Highlight */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-wedding-gold/10 to-orange-100/20 rounded-full px-8 py-4 border border-wedding-gold/20 shadow-lg mb-8">
              <Calendar size={24} className="text-wedding-gold" />
              <div className="text-center">
                <div className="text-wedding-maroon font-semibold text-lg">
                  {formatWeddingDate(weddingData.mainWedding.date)}
                </div>
                <div className="text-wedding-gold text-sm font-medium">
                  {weddingData.mainWedding.time}
                </div>
              </div>
              <Clock size={24} className="text-wedding-gold" />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></div>
              <Crown size={16} className="text-wedding-gold animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-wedding-gold/60 animate-pulse"></div>
              <Crown size={16} className="text-wedding-gold animate-pulse" />
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></div>
            </div>
          </div>
        </div>

        {/* Countdown Timer Section */}
        <div className="bg-gradient-to-br from-wedding-cream/30 via-wedding-blush/10 to-wedding-cream/30 py-12">
          <div className="w-full max-w-4xl mx-auto px-4">
            <CountdownTimer />
          </div>
        </div>

        {/* Event Timeline Section */}
        <div className="flex-grow">
          <EventTimeline />
        </div>

        {/* Sacred Blessings Bottom Section */}
        <div className="w-full py-8 bg-gradient-to-t from-wedding-cream/40 to-transparent">
          <div className="text-center">
            <p className="text-wedding-maroon font-dancing-script text-xl italic mb-4">
              "May Lord Ganesha remove all obstacles and bless this sacred union"
            </p>
            <p className="text-wedding-gold/70 text-sm mb-4">ॐ गं गणपतये नमः</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Crown size={12} className="text-wedding-gold/60" />
              <div className="w-8 h-[1px] bg-wedding-gold/40"></div>
              <div className="w-2 h-2 rounded-full bg-wedding-gold/40"></div>
              <div className="w-8 h-[1px] bg-wedding-gold/40"></div>
              <Crown size={12} className="text-wedding-gold/60" />
            </div>
          </div>
        </div>

      </div>

      <NavigationBar currentPage={4} totalPages={5} />
    </PageWrapper>
  );
};

export default CeremoniesPage;