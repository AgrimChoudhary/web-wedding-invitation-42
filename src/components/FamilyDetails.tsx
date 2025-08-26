
import React, { useState, useEffect } from 'react';
import FamilyMemberCard from './FamilyMemberCard';
import { Heart, Users, Crown, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useWedding } from '@/context/WeddingContext';
import OptimizedImage from './OptimizedImage';
import { FamilyPhotoSkeleton } from './ImageSkeleton';


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

  // Enhanced logging for family data debugging
  React.useEffect(() => {
  }, [propGroomFamily, propBrideFamily, weddingData?.family]);

  // Use props if provided, otherwise use from context with fallback to sample data
  const groomFamily = propGroomFamily || weddingData.family.groomFamily || {
    title: "Groom's Family",
    members: [],
    familyPhotoUrl: "",
    parentsNameCombined: "Parents of the Groom"
  };
  const brideFamily = propBrideFamily || weddingData.family.brideFamily || {
    title: "Bride's Family", 
    members: [],
    familyPhotoUrl: "",
    parentsNameCombined: "Parents of the Bride"
  };

  // Debug logging for family data in component

  const handleShowFamily = (family: FamilyData) => {
    
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
      className="relative rounded-xl overflow-hidden luxury-card group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 luxury-glow-border opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="relative bg-gradient-to-br from-white/95 to-wedding-cream/80 backdrop-blur-sm p-6 sm:p-8">
        {/* Family Title */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-wedding-maroon font-playfair text-lg sm:text-xl flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown size={18} className="text-wedding-gold" />
            </motion.div>
            {family.title}
            <motion.div
              animate={{ rotate: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Crown size={18} className="text-wedding-gold" />
            </motion.div>
          </h3>
        </motion.div>
        
        {/* Round Family Photo */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-wedding-gold/30 shadow-lg group-hover:border-wedding-gold/50 transition-all duration-500 bg-wedding-cream/50 group-hover:shadow-xl">
              <OptimizedImage
                src={family.familyPhotoUrl && family.familyPhotoUrl.trim() !== '' ? family.familyPhotoUrl : (family.title.includes("Groom") ? "/images/groom-family-placeholder.jpg" : "/images/bride-family-placeholder.jpg")}
                alt={`${family.title} Photo`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                priority="medium"
                enableBlurTransition={true}
                fallbackSrc={family.title.includes("Groom") ? "/images/groom-family-placeholder.jpg" : "/images/bride-family-placeholder.jpg"}
              />
            </div>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Heart size={12} className="text-background drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Parents Names */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mb-6"
        >
          {family.parentsNameCombined && family.parentsNameCombined.trim() !== '' ? (
            <>
              <h4 className="font-playfair text-base sm:text-lg text-wedding-maroon mb-1 leading-relaxed">
                {family.parentsNameCombined}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 italic font-medium">
                Parents of the {family.title.includes("Groom") ? "Groom" : "Bride"}
              </p>
            </>
          ) : (
            <>
              <h4 className="font-playfair text-base sm:text-lg text-wedding-maroon mb-1 leading-relaxed">
                Blessed to join our families
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 italic font-medium">
                United in love and tradition
              </p>
            </>
          )}
        </motion.div>

        {/* View Details Button */}
        <motion.div 
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleShowFamily(family);
            }}
            className="bg-wedding-gold/10 text-wedding-maroon border border-wedding-gold/30 hover:bg-wedding-gold/20 hover:border-wedding-gold/50 transition-all duration-300 px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer text-sm font-medium"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={14} /> 
            <span>View Family Details</span>
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Sparkles size={12} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-br from-wedding-cream via-wedding-blush/5 to-wedding-cream relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      <motion.div 
        className="absolute top-10 left-10 w-2 h-2 bg-wedding-gold/30 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-32 right-16 w-3 h-3 bg-wedding-maroon/20 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-2.5 h-2.5 bg-wedding-gold/40 rounded-full"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown size={20} className="text-wedding-gold sm:w-6 sm:h-6" />
            </motion.div>
            <h2 className="font-dancing-script text-2xl sm:text-3xl md:text-4xl text-wedding-maroon">Our Royal Families</h2>
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Crown size={20} className="text-wedding-gold sm:w-6 sm:h-6" />
            </motion.div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed px-4">
            Meet the distinguished families who raised us with love, values, and blessings
          </p>
          <motion.div 
            className="flex items-center justify-center gap-3 mt-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="h-[1px] w-16 sm:w-20 bg-gradient-to-r from-transparent via-wedding-gold/60 to-wedding-gold"></div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={12} className="text-wedding-gold" />
            </motion.div>
            <div className="h-[1px] w-16 sm:w-20 bg-gradient-to-l from-transparent via-wedding-gold/60 to-wedding-gold"></div>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* First Family Card (based on groomFirst flag) */}
          <FamilyCard family={firstFamily} />

          {/* Second Family Card (based on groomFirst flag) */}
          <FamilyCard family={secondFamily} />
        </div>

        {/* Enhanced Family Details Dialog */}
        <AnimatePresence>
          {isDialogOpen && (
            <Dialog 
              open={isDialogOpen} 
              onOpenChange={(open) => {
                setIsDialogOpen(open);
              }}
            >
              <DialogContent 
                className="max-w-xs sm:max-w-lg md:max-w-2xl bg-gradient-to-br from-white/98 to-wedding-cream/95 backdrop-blur-md border-2 border-wedding-gold/30 shadow-2xl mx-4"
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <DialogHeader>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <DialogTitle className="text-xl sm:text-2xl font-dancing-script text-wedding-maroon flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Heart size={16} className="text-wedding-gold" />
                        </motion.div>
                        {selectedFamily?.title} 
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                          <Heart size={16} className="text-wedding-gold" />
                        </motion.div>
                      </DialogTitle>
                      <DialogDescription className="text-center text-gray-600 text-sm">
                        With love and blessings for our special day
                      </DialogDescription>
                    </motion.div>
                  </DialogHeader>
                  
                  <motion.div 
                    className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {selectedFamily && getDialogMembers(selectedFamily.members).length > 0 ? (
                      getDialogMembers(selectedFamily.members).map((member, index) => (
                        <motion.div 
                          key={index} 
                          className="bg-gradient-to-br from-white/90 to-wedding-cream/60 rounded-lg shadow-sm p-3 sm:p-4 border border-wedding-gold/20 hover:border-wedding-gold/40 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.4 }}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.15)" 
                          }}
                        >
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-wedding-gold/30 shadow-lg flex-shrink-0">
                              <AspectRatio ratio={1} className="bg-wedding-cream/50">
                                <OptimizedImage
                                  src={member.image || "/placeholder.svg"}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                  priority="low"
                                  enableBlurTransition={true}
                                />
                              </AspectRatio>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <h4 className="font-playfair text-base sm:text-lg text-wedding-maroon">{member.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 font-medium">{member.relation}</p>
                              {member.description && (
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{member.description}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        className="text-center py-6 sm:py-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <motion.div 
                          className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-wedding-gold/10 rounded-full mb-4"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Heart size={20} className="text-wedding-gold sm:w-6 sm:h-6" />
                        </motion.div>
                        <h3 className="font-playfair text-lg sm:text-xl text-wedding-maroon mb-2">Family Details Coming Soon</h3>
                        <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed px-4">
                          We're excited to share more details about our wonderful families who have supported our journey.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced custom styles for luxury effects */}
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
          transform: translateY(-2px);
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

        /* Custom scrollbar for mobile */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(212, 175, 55, 0.3) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(212, 175, 55, 0.3);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(212, 175, 55, 0.5);
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .luxury-card {
            box-shadow: 0 4px 16px rgba(139,69,19,0.08), 0 1px 4px rgba(212,175,55,0.1);
          }
          
          .luxury-card:hover {
            box-shadow: 0 8px 24px rgba(139,69,19,0.12), 0 4px 8px rgba(212,175,55,0.2);
          }
        }
      `}</style>
      
    </section>
  );
};

export default FamilyDetails;
