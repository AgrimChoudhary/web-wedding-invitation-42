import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import NavigationBar from '@/components/NavigationBar';
import CoupleSection from '@/components/CoupleSection';
import RomanticJourneySection from '@/components/RomanticJourneySection';
import { useWedding } from '@/context/WeddingContext';

const JourneyPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { weddingData } = useWedding();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper pageNumber={3} totalPages={5}>
      <div className={`w-full min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Romantic Header Section */}
        <div className="w-full py-16 bg-gradient-to-br from-pink-50/60 via-wedding-blush/20 to-wedding-cream/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-red-400/5"></div>
          
          {/* Floating Hearts */}
          <div className="absolute top-20 left-20 w-4 h-4 text-red-300/40 animate-float">
            <Heart className="w-full h-full fill-current" />
          </div>
          <div className="absolute bottom-24 right-24 w-6 h-6 text-pink-300/40 animate-float" style={{ animationDelay: '1s' }}>
            <Heart className="w-full h-full fill-current" />
          </div>
          <div className="absolute top-32 right-32 w-3 h-3 text-red-400/40 animate-float" style={{ animationDelay: '2s' }}>
            <Heart className="w-full h-full fill-current" />
          </div>
          
          <div className="w-full max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart size={28} className="text-red-400 animate-pulse fill-current" />
              <span className="inline-block py-3 px-8 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full text-lg font-semibold text-wedding-maroon border border-red-300/30 tracking-wider shadow-lg">
                Love Story
              </span>
              <Heart size={28} className="text-red-400 animate-pulse fill-current" />
            </div>
            
            <h1 className="font-great-vibes text-5xl md:text-6xl text-wedding-maroon mb-6 drop-shadow-lg">
              Our Romantic Journey
            </h1>
            
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg mb-8">
              Every love story is beautiful, but ours is our favorite. Journey with us through the moments that led us to this sacred celebration of eternal love and togetherness.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-red-400/60 to-red-400"></div>
              <Sparkles size={16} className="text-red-400 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-red-400/60 animate-pulse"></div>
              <Sparkles size={16} className="text-red-400 animate-pulse" />
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-red-400/60 to-red-400"></div>
            </div>
          </div>
        </div>

        {/* Couple Section */}
        <div className="bg-wedding-cream/20">
          <CoupleSection />
        </div>

        {/* Romantic Journey Section */}
        <div className="flex-grow bg-gradient-to-br from-wedding-cream/30 via-pink-50/20 to-wedding-cream/30">
          <RomanticJourneySection />
        </div>

        {/* Decorative Bottom Section */}
        <div className="w-full py-8 bg-gradient-to-t from-wedding-cream/40 to-transparent">
          <div className="text-center">
            <p className="text-wedding-maroon font-dancing-script text-xl italic mb-4">
              "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage"
            </p>
            <p className="text-wedding-gold/70 text-sm">- Lao Tzu</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Heart size={12} className="text-red-400/60 fill-current" />
              <div className="w-8 h-[1px] bg-red-400/40"></div>
              <div className="w-2 h-2 rounded-full bg-red-400/40"></div>
              <div className="w-8 h-[1px] bg-red-400/40"></div>
              <Heart size={12} className="text-red-400/60 fill-current" />
            </div>
          </div>
        </div>

      </div>

      <NavigationBar currentPage={3} totalPages={5} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </PageWrapper>
  );
};

export default JourneyPage;