import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  placeholderSrc?: string;
  blurDataUrl?: string;
  quality?: 'high' | 'medium' | 'low';
  enableLazyLoading?: boolean;
  enableBlurTransition?: boolean;
  fallbackSrc?: string;
  onLoadComplete?: (loadTime: number) => void;
  className?: string;
  skeletonClassName?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  priority = 'medium',
  placeholderSrc,
  blurDataUrl,
  quality = 'high',
  enableLazyLoading = true,
  enableBlurTransition = true,
  fallbackSrc,
  onLoadComplete,
  className,
  skeletonClassName,
  loading,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!enableLazyLoading || priority === 'critical');
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const loadStartTime = useRef<number>(0);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableLazyLoading || priority === 'critical' || isInView) return;

    const currentImgRef = imgRef.current;
    if (!currentImgRef) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            intersectionObserverRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    intersectionObserverRef.current.observe(currentImgRef);

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [enableLazyLoading, priority, isInView]);

  // Image loading logic
  useEffect(() => {
    if (!isInView) return;

    loadStartTime.current = performance.now();
    
    const img = new Image();
    
    img.onload = () => {
      const endTime = performance.now();
      const duration = endTime - loadStartTime.current;
      
      setIsLoaded(true);
      setHasError(false);
      setLoadTime(duration);
      onLoadComplete?.(duration);
    };

    img.onerror = () => {
      setHasError(true);
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false); // Reset error state for fallback attempt
      }
    };

    // Set crossOrigin for CDN images
    if (currentSrc.includes('supabase.co') || currentSrc.includes('cdn')) {
      img.crossOrigin = 'anonymous';
    }

    img.src = currentSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentSrc, isInView, fallbackSrc, onLoadComplete]);

  const handleImageLoad = useCallback(() => {
    if (!isLoaded) {
      const endTime = performance.now();
      const duration = endTime - loadStartTime.current;
      setIsLoaded(true);
      setLoadTime(duration);
      onLoadComplete?.(duration);
    }
  }, [isLoaded, onLoadComplete]);

  const handleImageError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  }, [fallbackSrc, currentSrc]);

  // Generate skeleton/placeholder dimensions
  const getPlaceholderStyle = () => {
    if (blurDataUrl) {
      return {
        backgroundImage: `url(${blurDataUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        transform: 'scale(1.1)' // Slightly larger to hide blur edges
      };
    }
    return {};
  };

  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        {...props}
      >
        <div className="text-center p-4">
          <div className="text-sm">Failed to load image</div>
          <div className="text-xs opacity-60">{alt}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)} ref={imgRef}>
      {/* Skeleton/Blur placeholder */}
      {!isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            blurDataUrl ? "" : "bg-muted animate-pulse",
            skeletonClassName
          )}
          style={getPlaceholderStyle()}
        >
          {!blurDataUrl && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          )}
        </div>
      )}

      {/* Low quality placeholder image */}
      {placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            "filter blur-sm scale-110"
          )}
          loading="eager"
        />
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isLoaded 
              ? "opacity-100 filter-none scale-100" 
              : "opacity-0 filter blur-sm scale-105",
            enableBlurTransition && "transition-all duration-700 ease-out"
          )}
          loading={
            priority === 'critical' 
              ? 'eager' 
              : loading || (enableLazyLoading ? 'lazy' : 'eager')
          }
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}

      {/* Loading indicator for critical images */}
      {priority === 'critical' && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-wedding-gold/20 border-t-wedding-gold rounded-full animate-spin" />
        </div>
      )}

      {/* Performance info (development only) */}
      {process.env.NODE_ENV === 'development' && loadTime && (
        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
          {Math.round(loadTime)}ms
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;