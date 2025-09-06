import { useEffect, useMemo } from 'react';
import { useAdvancedImagePreloader, ImagePriority } from './useAdvancedImagePreloader';
import { useServiceWorker } from './useServiceWorker';

// Production optimization hook with advanced image loading
export const useProductionOptimization = (weddingData: any) => {
  const { preloadImages } = useServiceWorker();

  // Organize images by priority levels
  const prioritizedImages = useMemo((): ImagePriority[] => {
    const images: ImagePriority[] = [];
    
    // Critical: Couple photo (above the fold)
    if (weddingData.couple?.coupleImageUrl) {
      images.push({
        url: weddingData.couple.coupleImageUrl,
        priority: 'critical',
        sizes: '(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw'
      });
    }
    
    // High: Family photos (visible on scroll)
    if (weddingData.family?.brideFamily?.familyPhotoUrl) {
      images.push({
        url: weddingData.family.brideFamily.familyPhotoUrl,
        priority: 'high',
        sizes: '(max-width: 640px) 100vw, 50vw'
      });
    }
    if (weddingData.family?.groomFamily?.familyPhotoUrl) {
      images.push({
        url: weddingData.family.groomFamily.familyPhotoUrl,
        priority: 'high',
        sizes: '(max-width: 640px) 100vw, 50vw'
      });
    }
    
    // Medium: First 3 gallery photos
    if (weddingData.photoGallery?.length > 0) {
      weddingData.photoGallery.slice(0, 3).forEach((photo: any) => {
        if (photo.url) {
          images.push({
            url: photo.url,
            priority: 'medium',
            sizes: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
          });
        }
      });
    }
    
    // Low: Remaining gallery photos
    if (weddingData.photoGallery?.length > 3) {
      weddingData.photoGallery.slice(3).forEach((photo: any) => {
        if (photo.url) {
          images.push({
            url: photo.url,
            priority: 'low',
            sizes: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
          });
        }
      });
    }
    
    return images.filter(img => img.url);
  }, [weddingData]);

  // Use advanced preloader with connection-aware loading
  const { 
    isLoading: imagesLoading, 
    progress, 
    connectionSpeed,
    criticalImagesLoaded 
  } = useAdvancedImagePreloader(prioritizedImages, {
    enableProgressiveLoading: true,
    enableConnectionAware: true,
    maxConcurrent: 4 // Will be adjusted based on connection speed internally
  });

  // Preload critical images via Service Worker
  useEffect(() => {
    const criticalUrls = prioritizedImages
      .filter(img => img.priority === 'critical')
      .map(img => img.url);
    
    if (criticalUrls.length > 0) {
      preloadImages(criticalUrls);
    }
  }, [prioritizedImages, preloadImages]);

  // Remove unused event listeners and cleanup in production
  useEffect(() => {
    // Cleanup any debug listeners
    const cleanup = () => {
      // Remove any development-only event listeners
    };

    return cleanup;
  }, []);

  return {
    isImagesLoading: imagesLoading,
    loadingProgress: progress,
    connectionSpeed,
    criticalImagesLoaded,
    totalImagesCount: prioritizedImages.length,
    criticalImagesCount: prioritizedImages.filter(img => img.priority === 'critical').length
  };
};