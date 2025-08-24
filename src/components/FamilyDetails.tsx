
import React, { useState } from 'react';
import FamilyMemberCard from './FamilyMemberCard';
import { Heart, Users, Crown, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { useWedding } from '@/context/WeddingContext';

interface FamilyMember {
  name: string;
  relation: string;
  image?: string;
  description?: string;
  showInDialogOnly?: boolean;
}

interface FamilyData {
  title: string;
  members: FamilyMember[];
  familyPhotoUrl?: string;
  parentsNameCombined?: string;
}

interface FamilyDetailsProps {
  groomFamily?: FamilyData;
  brideFamily?: FamilyData;
}

const FamilyDetails: React.FC<FamilyDetailsProps> = ({ 
  groomFamily: propGroomFamily, 
  brideFamily: propBrideFamily 
}) => {
  const [selectedFamily, setSelectedFamily] = useState<FamilyData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { weddingData } = useWedding();

  // Use props if provided, otherwise use from context
  const groomFamily = propGroomFamily || weddingData.family.groomFamily;
  const brideFamily = propBrideFamily || weddingData.family.brideFamily;

  // Debug logging for family data in component
  console.log('=== FAMILY DETAILS COMPONENT DEBUG ===');
  console.log('weddingData.family:', weddingData.family);
  console.log('groomFamily:', groomFamily);
  console.log('brideFamily:', brideFamily);
  console.log('groomFamily.familyPhotoUrl:', groomFamily?.familyPhotoUrl);
  console.log('groomFamily.parentsNameCombined:', groomFamily?.parentsNameCombined);
  console.log('brideFamily.familyPhotoUrl:', brideFamily?.familyPhotoUrl);
  console.log('brideFamily.parentsNameCombined:', brideFamily?.parentsNameCombined);
  console.log('=== END FAMILY DETAILS DEBUG ===');

  const handleShowFamily = (family: FamilyData) => {
    console.log('👨‍👩‍👧‍👦 User manually clicked on family:', family.title);
    setSelectedFamily(family);
    setIsDialogOpen(true);
  };

  // Filter out members that should only show in dialog
  const getVisibleMembers = (members: FamilyMember[]) => {
    return members.filter(member => !member.showInDialogOnly);
  };

  // For dialog view, show all members dynamically
  const getDialogMembers = (members: FamilyMember[]) => {
    // Return all members for dynamic rendering
    return members || [];
  };

  // Determine which family to show first based on groomFirst flag
  const firstFamily = weddingData.groomFirst ? groomFamily : brideFamily;
  const secondFamily = weddingData.groomFirst ? brideFamily : groomFamily;

  const FamilyCard = ({ family }: { family: FamilyData }) => (
    <motion.div 
      className="relative rounded-xl overflow-hidden luxury-card cursor-pointer group"
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onClick={(e) => {
        // Prevent automatic clicks
        if (!e.isTrusted) {
          console.log('🚫 Blocked automatic family card click');
          return;
        }
        handleShowFamily(family);
      }}
    >
      <div className="absolute inset-0 luxury-glow-border opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative bg-gradient-to-br from-white/95 to-wedding-cream/80 backdrop-blur-sm p-8">
        {/* Family Title */}
        <div className="text-center mb-6">
          <h3 className="text-wedding-maroon font-playfair text-xl flex items-center justify-center gap-2">
            <Crown size={18} className="text-wedding-gold" />
            {family.title}
          </h3>
        </div>
        
        {/* Round Family Photo */}
        <div className="flex justify-center mb-6">
          {family.familyPhotoUrl && family.familyPhotoUrl.trim() !== '' ? (
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-wedding-gold/30 shadow-lg group-hover:border-wedding-gold/50 transition-all duration-300">
                <img 
                  src={family.familyPhotoUrl} 
                  alt={`${family.title} Photo`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    console.warn(`Failed to load family photo for ${family.title}:`, family.familyPhotoUrl);
                    const target = e.target as HTMLImageElement;
                    target.src = family.title.includes("Groom") ? "/images/groom-family-placeholder.jpg" : "/images/bride-family-placeholder.jpg";
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center shadow-lg">
                <Heart size={12} className="text-background drop-shadow-md" />
              </div>
            </div>
          ) : (
            /* No Family Photo - Use Placeholder Image */
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-wedding-gold/30 shadow-lg group-hover:border-wedding-gold/50 transition-all duration-300">
                <img 
                  src={family.title.includes("Groom") ? "/images/groom-family-placeholder.jpg" : "/images/bride-family-placeholder.jpg"} 
                  alt={`${family.title} Photo`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center shadow-lg">
                <Heart size={12} className="text-background drop-shadow-md" />
              </div>
            </div>
          )}
        </div>
        
        {/* Parents Names */}
        {family.parentsNameCombined && family.parentsNameCombined.trim() !== '' ? (
          <div className="text-center mb-6">
            <h4 className="font-playfair text-lg text-wedding-maroon mb-1 leading-relaxed">
              {family.parentsNameCombined}
            </h4>
            <p className="text-sm text-gray-600 italic font-medium">
              Parents of the {family.title.includes("Groom") ? "Groom" : "Bride"}
            </p>
          </div>
        ) : (
          /* No Parents Names - Show Member Count */
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              {family.members.length > 0 ? `${family.members.length} family members` : 'Family details'}
            </p>
          </div>
        )}

        {/* View Details Button */}
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="bg-wedding-gold/10 text-wedding-maroon border-wedding-gold/30 group-hover:bg-wedding-gold/20 group-hover:border-wedding-gold/50 transition-all duration-300 px-4 py-2">
            <Users size={14} className="mr-2" /> 
            <span className="text-sm font-medium">View Family Details</span>
            <Sparkles size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Badge>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="w-full py-16 bg-gradient-to-br from-wedding-cream via-wedding-blush/5 to-wedding-cream relative overflow-hidden">
      {/* Royal background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      <div className="absolute top-10 left-10 w-2 h-2 bg-wedding-gold/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-16 w-3 h-3 bg-wedding-maroon/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-wedding-gold/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown size={24} className="text-wedding-gold animate-pulse" />
            <h2 className="font-dancing-script text-3xl sm:text-4xl text-wedding-maroon">Our Royal Families</h2>
            <Crown size={24} className="text-wedding-gold animate-pulse" />
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-4">
            Meet the distinguished families who raised us with love, values, and blessings
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></div>
            <Sparkles size={12} className="text-wedding-gold animate-pulse" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Family Card (based on groomFirst flag) */}
          <FamilyCard family={firstFamily} />

          {/* Second Family Card (based on groomFirst flag) */}
          <FamilyCard family={secondFamily} />
        </div>

        {/* Family Details Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            console.log('🔒 Family dialog state change:', open);
            setIsDialogOpen(open);
          }}
        >
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white/98 to-wedding-cream/95 backdrop-blur-md border-2 border-wedding-gold/30 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-dancing-script text-wedding-maroon flex items-center justify-center gap-2">
                <Heart size={16} className="text-wedding-gold animate-pulse" /> 
                {selectedFamily?.title} 
                <Heart size={16} className="text-wedding-gold animate-pulse" />
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                With love and blessings for our special day
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-6 mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {selectedFamily && getDialogMembers(selectedFamily.members).map((member, index) => (
                <div key={index} className="bg-gradient-to-br from-white/90 to-wedding-cream/60 rounded-lg shadow-sm p-4 border border-wedding-gold/20 hover:border-wedding-gold/40 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-wedding-gold/30 shadow-lg">
                      <AspectRatio ratio={1} className="bg-wedding-cream/50">
                        <img 
                          src={member.image || "/placeholder.svg"} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                          loading="eager"
                          decoding="async"
                        />
                      </AspectRatio>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-playfair text-lg text-wedding-maroon">{member.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">{member.relation}</p>
                      {member.description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{member.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Custom styles for luxury effects */}
      <style>{`
        .luxury-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(254,249,239,0.9) 100%);
          border: 1px solid rgba(212,175,55,0.2);
          box-shadow: 0 8px 32px rgba(139,69,19,0.1), 0 2px 8px rgba(212,175,55,0.15);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .luxury-card:hover {
          box-shadow: 0 20px 60px rgba(139,69,19,0.15), 0 8px 20px rgba(212,175,55,0.25);
        }

        .luxury-glow-border {
          background: linear-gradient(45deg, 
            transparent 0%, 
            rgba(212,175,55,0.4) 25%, 
            rgba(139,69,19,0.3) 50%, 
            rgba(212,175,55,0.4) 75%, 
            transparent 100%
          );
          background-size: 200% 200%;
          animation: luxury-glow 3s ease infinite;
        }

        @keyframes luxury-glow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default FamilyDetails;
