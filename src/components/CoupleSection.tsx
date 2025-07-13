
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWedding } from '@/context/WeddingContext';
import { formatWeddingDate } from '@/placeholders';

const CoupleSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const { weddingData } = useWedding();

  // Determine which name to show first based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? weddingData.couple.groomFirstName : weddingData.couple.brideFirstName;
  const secondPersonName = weddingData.groomFirst ? weddingData.couple.brideFirstName : weddingData.couple.groomFirstName;

  // Use coupleImageUrl if provided, otherwise fall back to couplePhotoUrl
  const coupleImage = weddingData.couple.coupleImageUrl || weddingData.couple.couplePhotoUrl || "https://www.koimoi.com/wp-content/new-galleries/2022/12/sidharth-malhotra-kiara-advani-to-have-a-grand-wedding-in-february-01.jpg";

  return (
    <section className="w-full py-8 md:py-10 overflow-hidden bg-wedding-cream/20">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-dancing-script text-2xl sm:text-3xl text-wedding-maroon mb-2">Our Wedding Journey</h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Join us as we celebrate our love and begin our journey together with blessings from family and friends
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
        </div>

        <div className="glass-card overflow-hidden shadow-gold-soft hover:shadow-gold-glow transition-all duration-700 relative mb-8">
          <div 
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AspectRatio ratio={isMobile ? 4/3 : 20/9} className="bg-wedding-cream">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={coupleImage} 
                  alt={`${firstPersonName} and ${secondPersonName} Wedding`} 
                  className={`w-full h-full object-cover transition-transform duration-10000 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  loading="eager"
                  decoding="async"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-30' : 'opacity-60'}`}></div>
                
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-3 left-3 w-12 h-12 md:w-16 md:h-16">
                    <img 
                      src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                      alt="Kalash decoration" 
                      className="w-full h-full object-contain opacity-40"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="absolute top-3 right-3 w-12 h-12 md:w-16 md:h-16">
                    <img 
                      src="/lovable-uploads/a3236bd1-0ba5-41b5-a422-ef2a60c43cd4.png" 
                      alt="Om symbol" 
                      className="w-full h-full object-contain opacity-40"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-wedding-gold/30"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-wedding-gold/30"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-wedding-gold/30"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-wedding-gold/30"></div>
                </div>
              </div>
            </AspectRatio>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex justify-center">
              <div className="inline-block py-1.5 px-4 bg-wedding-gold/60 backdrop-blur-sm rounded-full text-white text-sm shadow-gold-soft">
                <Calendar size={isMobile ? 14 : 16} className="inline-block mr-2" />
                <span>{formatWeddingDate(weddingData.mainWedding.date)} at {weddingData.mainWedding.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
