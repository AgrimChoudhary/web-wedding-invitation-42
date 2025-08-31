import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import NavigationBar from '@/components/NavigationBar';
import FamilyDetails from '@/components/FamilyDetails';
import { useWedding } from '@/context/WeddingContext';

const FamiliesPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { weddingData } = useWedding();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper pageNumber={2} totalPages={5}>
      <div className={`w-full min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Royal Header Section */}
        <div className="w-full py-16 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
          
          <div className="w-full max-w-4xl mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Crown size={28} className="text-wedding-gold animate-pulse" />
              <span className="inline-block py-3 px-8 bg-gradient-to-r from-wedding-gold/20 to-wedding-maroon/20 rounded-full text-lg font-semibold text-wedding-gold border border-wedding-gold/30 tracking-wider shadow-lg">
                Royal Families
              </span>
              <Crown size={28} className="text-wedding-gold animate-pulse" />
            </div>
            
            <h1 className="font-great-vibes text-5xl md:text-6xl text-wedding-maroon mb-6 drop-shadow-lg">
              Sacred Families & Blessings
            </h1>
            
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg mb-8">
              With the blessings of our beloved families, we unite two hearts, two souls, and two traditions in the sacred bond of marriage. Meet the pillars of love and strength who have shaped our journey.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></div>
              <div className="w-3 h-3 rounded-full bg-wedding-gold/60 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-wedding-gold/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 rounded-full bg-wedding-gold/60 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="h-[2px] w-24 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></div>
            </div>
          </div>
        </div>

        {/* Family Details Section */}
        <div className="flex-grow bg-wedding-cream/20 py-12">
          <div className="w-full max-w-6xl mx-auto px-4">
            <FamilyDetails 
              groomFamily={weddingData.family.groomFamily} 
              brideFamily={weddingData.family.brideFamily}
            />
          </div>
        </div>

        {/* Decorative Bottom Section */}
        <div className="w-full py-8 bg-gradient-to-t from-wedding-cream/40 to-transparent">
          <div className="text-center">
            <p className="text-wedding-maroon font-dancing-script text-xl italic">
              "A family is a little world created by love"
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-8 h-[1px] bg-wedding-gold/40"></div>
              <div className="w-2 h-2 rounded-full bg-wedding-gold/40"></div>
              <div className="w-8 h-[1px] bg-wedding-gold/40"></div>
            </div>
          </div>
        </div>

      </div>

      <NavigationBar currentPage={2} totalPages={5} />
    </PageWrapper>
  );
};

export default FamiliesPage;