import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MapPin, Phone, Heart } from 'lucide-react';
import { useWedding } from "@/context/WeddingContext";
import { formatWeddingDate } from '@/placeholders';

export const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  const { weddingData } = useWedding();
  
  // Determine which name to show first based on groomFirst flag
  const firstPersonName = weddingData.groomFirst ? weddingData.couple.groomFirstName : weddingData.couple.brideFirstName;
  const secondPersonName = weddingData.groomFirst ? weddingData.couple.brideFirstName : weddingData.couple.groomFirstName;
  
  return (
    <footer className="w-full py-8 mt-auto bg-gradient-to-b from-wedding-cream/10 to-wedding-cream/40 backdrop-blur-sm border-t border-wedding-gold/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent"></div>
      <div className="absolute -left-4 top-8 opacity-10 rotate-12">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#D4AF37" />
        </svg>
      </div>
      <div className="absolute -right-4 top-16 opacity-10 -rotate-12">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 17.5 7.5 13.5 7.5 10.5C7.5 7.5 10 5 12 5C14 5 16.5 7.5 16.5 10.5C16.5 13.5 12 17.5 12 22Z" fill="#D4AF37" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="glass-card hover:shadow-gold-soft transition-all duration-300 transform hover:scale-[1.02] overflow-hidden rounded-xl">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-xl"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-wedding-cream/50 flex items-center justify-center mb-3 border border-wedding-gold/30 shadow-gold-soft">
                  <MapPin size={20} className="text-wedding-maroon" />
                </div>
                <h3 className="text-lg font-playfair text-wedding-maroon mb-2">Venue</h3>
                <p className="text-sm font-medium text-gray-700 mb-1">{weddingData.mainWedding.venue.name}</p>
                <p className="text-xs text-gray-600 mb-3">{weddingData.mainWedding.venue.address}</p>
                
                {weddingData.mainWedding.venue.mapLink && (
                  <a 
                    href={weddingData.mainWedding.venue.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-wedding-gold/10 hover:bg-wedding-gold/20 text-wedding-maroon border border-wedding-gold/30 transition-all duration-300 text-xs font-medium"
                  >
                    View on Map
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="glass-card hover:shadow-gold-soft transition-all duration-300 transform hover:scale-[1.02] overflow-hidden rounded-xl">
            <div className="p-5 relative">
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-wedding-gold/30 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-wedding-gold/30 rounded-bl-xl"></div>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-wedding-cream/50 flex items-center justify-center mb-3 border border-wedding-gold/30 shadow-gold-soft">
                  <Phone size={20} className="text-wedding-maroon" />
                </div>
                <h3 className="text-lg font-playfair text-wedding-maroon mb-2">Contact</h3>
                {weddingData.contacts.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-1">{weddingData.contacts[0].name}</p>
                    <p className="text-xs text-gray-600 mb-3">{weddingData.contacts[0].relation}</p>
                    
                    <a 
                      href={`tel:${weddingData.contacts[0].phone}`} 
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-wedding-gold/10 hover:bg-wedding-gold/20 text-wedding-maroon border border-wedding-gold/30 transition-all duration-300 text-xs font-medium"
                    >
                      <Phone size={12} className="mr-1" />
                      {weddingData.contacts[0].phone}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-wedding-gold/30 to-transparent mb-6"></div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-wedding-gold/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-wedding-gold/40 animate-pulse"></div>
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-wedding-gold/50"></div>
          </div>
          
          <p className="text-base font-dancing-script text-wedding-maroon mb-1">
            Made with <span className="text-red-500">❤</span> for our special day
          </p>
          
          <p className="text-sm text-gray-500 font-dancing-script">
            With love, {firstPersonName} & {secondPersonName} | {formatWeddingDate(weddingData.mainWedding.date)}
          </p>
        </div>
      </div>
      
      {isMobile && <div className="h-16"></div>}
    </footer>
  );
};

export default Footer;