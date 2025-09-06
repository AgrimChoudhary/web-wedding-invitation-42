import { useEffect, useState, useCallback, useMemo } from 'react';
import { useConnectionSpeed } from './useConnectionSpeed';

export interface ImagePriority {
  url: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  sizes?: string;
  srcSet?: string;
}

interface PreloadedImages {
  [url: string]: {
    loaded: boolean;
    error: boolean;
    priority: string;
  };
}

interface PreloaderOptions {
  enableProgressiveLoading?: boolean;
  enableConnectionAware?: boolean;
  maxConcurrent?: number;
}

export const useAdvancedImagePreloader = (
  images: ImagePriority[],
  options: PreloaderOptions = {}
) => {
  const [loadedImages, setLoadedImages] = useState<PreloadedImages>({});
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { connectionSpeed, effectiveType } = useConnectionSpeed();

  const {
    enableProgressiveLoading = true,
    enableConnectionAware = true,
    maxConcurrent = 4
  } = options;

  // Prioritize images based on connection speed and priority
  const prioritizedImages = useMemo(() => {
    let filtered = [...images];

    if (enableConnectionAware) {
      if (effectiveType === '2g' || connectionSpeed === 'slow') {
        // Only load critical and high priority on slow connections
        filtered = images.filter(img => 
          img.priority === 'critical' || img.priority === 'high'
        );
      } else if (effectiveType === '3g' || connectionSpeed === 'medium') {
        // Skip low priority on medium connections
        filtered = images.filter(img => img.priority !== 'low');
      }
    }

    return filtered.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [images, enableConnectionAware, effectiveType, connectionSpeed]);

  const preloadImage = useCallback((imageData: ImagePriority): Promise<void> => {
    return new Promise((resolve) => {
      if (!imageData.url) {
        resolve();
        return;
      }

      const img = new Image();
      
      // Set loading priority for browsers that support it
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = imageData.priority === 'critical' ? 'high' : 'auto';
      }
      
      // Set responsive attributes if provided
      if (imageData.srcSet) img.srcset = imageData.srcSet;
      if (imageData.sizes) img.sizes = imageData.sizes;

      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [imageData.url]: { loaded: true, error: false, priority: imageData.priority }
        }));
        resolve();
      };

      img.onerror = () => {
        setLoadedImages(prev => ({
          ...prev,
          [imageData.url]: { loaded: false, error: true, priority: imageData.priority }
        }));
        resolve();
      };

      img.src = imageData.url;
    });
  }, []);

  const preloadImagesBatch = useCallback(async (batch: ImagePriority[]) => {
    const promises = batch.map(img => preloadImage(img));
    await Promise.all(promises);
  }, [preloadImage]);

  useEffect(() => {
    if (!prioritizedImages.length) {
      setIsLoading(false);
      return;
    }

    const preloadImages = async () => {
      let loadedCount = 0;
      const totalImages = prioritizedImages.length;

      if (enableProgressiveLoading) {
        // Load in batches by priority
        const criticalImages = prioritizedImages.filter(img => img.priority === 'critical');
        const highImages = prioritizedImages.filter(img => img.priority === 'high');
        const mediumImages = prioritizedImages.filter(img => img.priority === 'medium');
        const lowImages = prioritizedImages.filter(img => img.priority === 'low');

        // Load critical images first
        if (criticalImages.length > 0) {
          await preloadImagesBatch(criticalImages);
          loadedCount += criticalImages.length;
          setProgress((loadedCount / totalImages) * 100);
        }

        // Load high priority images
        if (highImages.length > 0) {
          await preloadImagesBatch(highImages);
          loadedCount += highImages.length;
          setProgress((loadedCount / totalImages) * 100);
        }

        // Load medium and low priority in parallel
        const remainingImages = [...mediumImages, ...lowImages];
        if (remainingImages.length > 0) {
          // Split into concurrent batches
          const batches = [];
          for (let i = 0; i < remainingImages.length; i += maxConcurrent) {
            batches.push(remainingImages.slice(i, i + maxConcurrent));
          }

          for (const batch of batches) {
            await preloadImagesBatch(batch);
            loadedCount += batch.length;
            setProgress((loadedCount / totalImages) * 100);
          }
        }
      } else {
        // Load all images in parallel with concurrency limit
        const batches = [];
        for (let i = 0; i < prioritizedImages.length; i += maxConcurrent) {
          batches.push(prioritizedImages.slice(i, i + maxConcurrent));
        }

        for (const batch of batches) {
          await preloadImagesBatch(batch);
          loadedCount += batch.length;
          setProgress((loadedCount / totalImages) * 100);
        }
      }

      setIsLoading(false);
    };

    preloadImages();
  }, [prioritizedImages, enableProgressiveLoading, maxConcurrent, preloadImagesBatch]);

  return {
    loadedImages,
    isLoading,
    progress,
    connectionSpeed,
    effectiveType,
    criticalImagesLoaded: Object.values(loadedImages).filter(
      img => img.priority === 'critical' && img.loaded
    ).length
  };
};