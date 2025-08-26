import { useEffect, useState, useCallback, useRef } from 'react';

export interface ImageLoadState {
  url: string;
  isLoaded: boolean;
  hasError: boolean;
  isLoading: boolean;
  loadTime?: number;
}

interface AdvancedImagePreloaderConfig {
  priority: 'critical' | 'high' | 'medium' | 'low';
  format: 'webp' | 'jpeg' | 'png' | 'auto';
  quality: 'high' | 'medium' | 'low';
  fallbackUrls?: string[];
  enableCache: boolean;
}

// Network speed detection
const detectConnectionSpeed = (): 'slow' | 'medium' | 'fast' => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  if (!connection) return 'medium';
  
  const effectiveType = connection.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (effectiveType === '3g') return 'medium';
  return 'fast';
};

// WebP support detection
const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => resolve(webP.height === 2);
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Image compression utility
const compressImage = (url: string, quality: 'high' | 'medium' | 'low'): string => {
  // For production, this would integrate with a CDN or image service
  const qualityMap = { high: 90, medium: 70, low: 50 };
  return url; // Placeholder - would add quality parameters in real implementation
};

// Cache management
class ImageCache {
  private static instance: ImageCache;
  private cache = new Map<string, ImageLoadState>();
  private maxSize = 50;

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  set(url: string, state: ImageLoadState): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(url, state);
    
    // Persist critical images to localStorage
    try {
      const cached = Array.from(this.cache.entries()).slice(-10);
      localStorage.setItem('image-cache', JSON.stringify(cached));
    } catch (e) {
      console.warn('Failed to cache images to localStorage');
    }
  }

  get(url: string): ImageLoadState | undefined {
    return this.cache.get(url);
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem('image-cache');
  }

  loadFromStorage(): void {
    try {
      const cached = localStorage.getItem('image-cache');
      if (cached) {
        const entries = JSON.parse(cached);
        entries.forEach(([url, state]: [string, ImageLoadState]) => {
          this.cache.set(url, state);
        });
      }
    } catch (e) {
      console.warn('Failed to load image cache from localStorage');
    }
  }
}

export const useAdvancedImagePreloader = (
  urls: string[],
  config: Partial<AdvancedImagePreloaderConfig> = {}
) => {
  const [imageStates, setImageStates] = useState<Map<string, ImageLoadState>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [supportsWebPFormat, setSupportsWebPFormat] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cache = ImageCache.getInstance();

  const defaultConfig: AdvancedImagePreloaderConfig = {
    priority: 'medium',
    format: 'auto',
    quality: 'high',
    enableCache: true,
    ...config
  };

  // Initialize image states
  useEffect(() => {
    const initialStates = new Map<string, ImageLoadState>();
    urls.forEach(url => {
      if (url) {
        const cachedState = cache.get(url);
        initialStates.set(url, cachedState || {
          url,
          isLoaded: false,
          hasError: false,
          isLoading: false
        });
      }
    });
    setImageStates(initialStates);
  }, [urls]);

  // Detect capabilities
  useEffect(() => {
    setConnectionSpeed(detectConnectionSpeed());
    supportsWebP().then(setSupportsWebPFormat);
    cache.loadFromStorage();
  }, []);

  const preloadImage = useCallback(async (
    url: string,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  ): Promise<void> => {
    if (!url) return;

    // Check cache first
    const cachedState = cache.get(url);
    if (cachedState?.isLoaded) {
      setImageStates(prev => new Map(prev.set(url, cachedState)));
      return;
    }

    const startTime = performance.now();
    
    setImageStates(prev => new Map(prev.set(url, {
      url,
      isLoaded: false,
      hasError: false,
      isLoading: true
    })));

    try {
      const img = new Image();
      
      // Optimize based on connection speed and priority
      if (connectionSpeed === 'slow' && priority !== 'critical') {
        img.loading = 'lazy';
      }

      // Set crossOrigin for CDN images
      if (url.includes('supabase.co') || url.includes('cdn')) {
        img.crossOrigin = 'anonymous';
      }

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const loadTime = performance.now() - startTime;
          const state: ImageLoadState = {
            url,
            isLoaded: true,
            hasError: false,
            isLoading: false,
            loadTime
          };

          setImageStates(prev => new Map(prev.set(url, state)));
          
          if (defaultConfig.enableCache) {
            cache.set(url, state);
          }
          
          resolve();
        };

        img.onerror = () => {
          const state: ImageLoadState = {
            url,
            isLoaded: false,
            hasError: true,
            isLoading: false,
            loadTime: performance.now() - startTime
          };

          setImageStates(prev => new Map(prev.set(url, state)));
          
          // Try fallback URLs if available
          if (defaultConfig.fallbackUrls && defaultConfig.fallbackUrls.length > 0) {
            const fallbackUrl = defaultConfig.fallbackUrls[0];
            preloadImage(fallbackUrl, priority).then(resolve).catch(reject);
          } else {
            resolve(); // Don't reject to prevent blocking other images
          }
        };

        img.src = url;
      });
    } catch (error) {
      console.warn(`Failed to preload image: ${url}`, error);
      setImageStates(prev => new Map(prev.set(url, {
        url,
        isLoaded: false,
        hasError: true,
        isLoading: false
      })));
    }
  }, [connectionSpeed, defaultConfig]);

  // Progressive loading based on priority
  useEffect(() => {
    if (!urls.length) {
      setIsLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    
    const loadImages = async () => {
      try {
        // Group URLs by priority
        const criticalUrls = urls.slice(0, 2); // First 2 are critical (Ganesha, couple photo)
        const highUrls = urls.slice(2, 5); // Next 3 are high priority (family photos)
        const mediumUrls = urls.slice(5, 8); // Next 3 are medium (gallery previews)
        const lowUrls = urls.slice(8); // Rest are low priority

        // Load critical images first (parallel)
        if (criticalUrls.length > 0) {
          await Promise.all(
            criticalUrls.map(url => preloadImage(url, 'critical'))
          );
        }

        // Load high priority images
        if (highUrls.length > 0) {
          await Promise.all(
            highUrls.map(url => preloadImage(url, 'high'))
          );
        }

        // Load medium priority with delay for better perceived performance
        if (mediumUrls.length > 0) {
          setTimeout(() => {
            Promise.all(
              mediumUrls.map(url => preloadImage(url, 'medium'))
            );
          }, connectionSpeed === 'slow' ? 1000 : 500);
        }

        // Load low priority images with longer delay
        if (lowUrls.length > 0) {
          setTimeout(() => {
            Promise.all(
              lowUrls.map(url => preloadImage(url, 'low'))
            );
          }, connectionSpeed === 'slow' ? 3000 : 1500);
        }

      } catch (error) {
        console.warn('Image preloading failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [urls, preloadImage, connectionSpeed]);

  const getImageState = useCallback((url: string): ImageLoadState | undefined => {
    return imageStates.get(url);
  }, [imageStates]);

  const getLoadedUrls = useCallback((): string[] => {
    return Array.from(imageStates.entries())
      .filter(([_, state]) => state.isLoaded)
      .map(([url]) => url);
  }, [imageStates]);

  const getFailedUrls = useCallback((): string[] => {
    return Array.from(imageStates.entries())
      .filter(([_, state]) => state.hasError)
      .map(([url]) => url);
  }, [imageStates]);

  const getTotalProgress = useCallback((): number => {
    const total = imageStates.size;
    if (total === 0) return 100;
    
    const loaded = Array.from(imageStates.values()).filter(state => state.isLoaded || state.hasError).length;
    return Math.round((loaded / total) * 100);
  }, [imageStates]);

  const retryFailedImages = useCallback((): void => {
    const failedUrls = getFailedUrls();
    failedUrls.forEach(url => preloadImage(url));
  }, [getFailedUrls, preloadImage]);

  return {
    imageStates,
    isLoading,
    connectionSpeed,
    supportsWebP: supportsWebPFormat,
    getImageState,
    getLoadedUrls,
    getFailedUrls,
    getTotalProgress,
    retryFailedImages,
    preloadImage
  };
};

// Hook for critical wedding images
export const useCriticalWeddingImages = (
  ganeshaUrl: string,
  coupleUrl: string,
  familyPhotos: string[],
  galleryPhotos: string[]
) => {
  const criticalUrls = [
    ganeshaUrl,
    coupleUrl,
    ...familyPhotos.slice(0, 2), // First 2 family photos
    ...galleryPhotos.slice(0, 3) // First 3 gallery photos
  ].filter(Boolean);

  return useAdvancedImagePreloader(criticalUrls, {
    priority: 'critical',
    quality: 'high',
    enableCache: true
  });
};