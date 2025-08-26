import React from 'react';
import { cn } from '@/lib/utils';

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: number;
  variant?: 'rectangular' | 'circular' | 'gallery' | 'hero' | 'avatar';
  showShimmer?: boolean;
  children?: React.ReactNode;
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  className,
  aspectRatio,
  variant = 'rectangular',
  showShimmer = true,
  children
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full aspect-square';
      case 'gallery':
        return 'rounded-lg aspect-[4/3]';
      case 'hero':
        return 'rounded-xl aspect-[16/9]';
      case 'avatar':
        return 'rounded-full aspect-square w-16 h-16';
      default:
        return 'rounded-lg';
    }
  };

  const baseStyles = cn(
    "relative overflow-hidden bg-muted",
    getVariantStyles(),
    className
  );

  const customAspectRatio = aspectRatio ? { aspectRatio } : {};

  return (
    <div 
      className={baseStyles}
      style={customAspectRatio}
    >
      {/* Base skeleton background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted" />
      
      {/* Shimmer effect */}
      {showShimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
      
      {/* Pulse effect for additional visual feedback */}
      <div className="absolute inset-0 bg-muted/50 animate-pulse" />
      
      {/* Content overlay */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
      
      {/* Decorative elements for specific variants */}
      {variant === 'gallery' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <div className="w-4 h-4 bg-muted-foreground/40 rounded-sm" />
          </div>
        </div>
      )}
      
      {variant === 'avatar' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
        </div>
      )}
    </div>
  );
};

// Pre-configured skeleton components for common use cases
export const GaneshaImageSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <ImageSkeleton 
    variant="circular" 
    className={cn("w-32 h-32 sm:w-36 sm:h-36", className)}
    showShimmer={true}
  >
    <div className="text-muted-foreground/40 text-sm">🕉️</div>
  </ImageSkeleton>
);

export const CoupleImageSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <ImageSkeleton 
    variant="rectangular" 
    className={cn("w-44 h-auto sm:w-52 md:w-60 lg:w-72", className)}
    aspectRatio={1}
    showShimmer={true}
  >
    <div className="text-muted-foreground/40 text-sm">💑</div>
  </ImageSkeleton>
);

export const GalleryImageSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <ImageSkeleton 
    variant="gallery" 
    className={className}
    showShimmer={true}
  />
);

export const FamilyPhotoSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <ImageSkeleton 
    variant="rectangular" 
    className={className}
    aspectRatio={4/3}
    showShimmer={true}
  >
    <div className="text-muted-foreground/40 text-sm">👨‍👩‍👧‍👦</div>
  </ImageSkeleton>
);

export default ImageSkeleton;