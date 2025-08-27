import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Crown, Sparkles } from 'lucide-react';

export const TemplateLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-wedding-cream/20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto"
          >
            <Crown size={64} className="text-wedding-gold" />
          </motion.div>
        </div>
        
        <h2 className="font-dancing-script text-2xl text-wedding-maroon mb-2">
          Preparing Your Invitation
        </h2>
        
        <p className="text-gray-600 mb-4">
          Loading beautiful memories and details...
        </p>
        
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            <Heart size={12} className="text-wedding-gold" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            <Sparkles size={12} className="text-wedding-gold" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          >
            <Heart size={12} className="text-wedding-gold" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const PhotoGridSkeleton: React.FC = () => {
  return (
    <div className="relative bg-white p-4 sm:p-5 rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-wedding-cream/20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-wedding-cream/50 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      <div className="flex justify-center mt-3 gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="w-2 h-2 rounded-full bg-wedding-gold/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};