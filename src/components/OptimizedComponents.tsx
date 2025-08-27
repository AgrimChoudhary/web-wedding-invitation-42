import React from 'react';
import { motion } from 'framer-motion';

// Memoized components for better performance
export const MemoizedFamilyCard = React.memo(({ family, onShowFamily }: {
  family: any;
  onShowFamily: (family: any) => void;
}) => {
  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden luxury-card group"
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <img
        src={family.familyPhotoUrl}
        alt={family.title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
        <h3 className="text-lg font-semibold">{family.title}</h3>
        <p className="text-sm">
          {family.parentsNameCombined && <div>{family.parentsNameCombined}</div>}
          {family.members && <div>{family.members.length} Members</div>}
        </p>
        <button 
          onClick={() => onShowFamily(family)}
          className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          View Family
        </button>
      </div>
    </motion.div>
  );
});

export const MemoizedPhotoSlide = React.memo(({ photo, isActive, onLoad, onLike }: {
  photo: any;
  isActive: boolean;
  onLoad: () => void;
  onLike: () => void;
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img 
        src={photo.url} 
        alt={photo.title || "Wedding memory"} 
        className="w-full h-full object-cover"
        loading={isActive ? "eager" : "lazy"}
        onLoad={onLoad}
      />
      <div className="absolute bottom-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-t from-black to-transparent text-white">
        <span>{photo.title}</span>
        <button 
          onClick={onLike}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Like
        </button>
      </div>
    </div>
  );
});

MemoizedFamilyCard.displayName = 'MemoizedFamilyCard';
MemoizedPhotoSlide.displayName = 'MemoizedPhotoSlide';
