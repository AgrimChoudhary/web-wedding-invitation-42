import React from 'react';
import { ImageWithSkeleton } from './ImageWithSkeleton';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  onLoad?: () => void;
  onError?: () => void;
  enableBlurTransition?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  priority = 'medium',
  onLoad,
  onError,
  enableBlurTransition = true
}) => {
  // Generate responsive image URLs and srcSet
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc) return undefined;
    
    // For now, return the original src as we don't have image resizing service
    // In production, you would generate different sizes like:
    // return `${baseSrc}?w=400 400w, ${baseSrc}?w=800 800w, ${baseSrc}?w=1200 1200w`;
    return undefined;
  };

  const generateSizes = () => {
    // Define responsive sizes based on the image context
    return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw";
  };

  const generatePlaceholderSrc = (originalSrc: string) => {
    if (!originalSrc || !enableBlurTransition) return undefined;
    
    // For a real implementation, you'd generate a tiny blurred version
    // For now, return undefined as we don't have image processing
    return undefined;
  };

  return (
    <ImageWithSkeleton
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      sizes={generateSizes()}
      srcSet={generateSrcSet(src)}
      onLoad={onLoad}
      onError={onError}
      enableBlurTransition={enableBlurTransition}
      placeholderSrc={generatePlaceholderSrc(src)}
    />
  );
};