import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  skeletonClassName?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
  enableBlurTransition?: boolean;
  placeholderSrc?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className,
  skeletonClassName,
  priority = 'medium',
  sizes,
  srcSet,
  onLoad,
  onError,
  enableBlurTransition = true,
  placeholderSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(enableBlurTransition && !!placeholderSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    // Set fetch priority for browsers that support it
    if ('fetchPriority' in img) {
      (img as any).fetchPriority = priority === 'critical' ? 'high' : 'auto';
    }

    if (srcSet) img.srcset = srcSet;
    if (sizes) img.sizes = sizes;

    img.onload = () => {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
      
      // Delay hiding placeholder for smooth transition
      if (showPlaceholder) {
        setTimeout(() => setShowPlaceholder(false), 300);
      }
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoaded(false);
      onError?.();
    };

    img.src = src;
  }, [src, srcSet, sizes, priority, onLoad, onError, showPlaceholder]);

  if (hasError) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Skeleton loading state */}
      {!isLoaded && (
        <Skeleton 
          className={cn(
            "absolute inset-0 w-full h-full", 
            skeletonClassName
          )} 
        />
      )}
      
      {/* Blur placeholder (if enabled and provided) */}
      {showPlaceholder && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        loading={priority === 'critical' ? 'eager' : 'lazy'}
        fetchPriority={priority === 'critical' ? 'high' : 'auto'}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};