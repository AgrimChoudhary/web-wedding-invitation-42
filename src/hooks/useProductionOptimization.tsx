import { useEffect, useMemo } from 'react';
import { useImagePreloader } from './useImagePreloader';

// Production optimization hook
export const useProductionOptimization = (weddingData: any) => {
  // Preload critical images only
  const criticalImages = useMemo(() => {
    const images = [];
    
    // Couple photo
    if (weddingData.couple?.coupleImageUrl) {
      images.push(weddingData.couple.coupleImageUrl);
    }
    
    // First 2 gallery photos for immediate display
    if (weddingData.photoGallery?.length > 0) {
      images.push(...weddingData.photoGallery.slice(0, 2).map((p: any) => p.url));
    }
    
    // Family photos
    if (weddingData.family?.brideFamily?.familyPhotoUrl) {
      images.push(weddingData.family.brideFamily.familyPhotoUrl);
    }
    if (weddingData.family?.groomFamily?.familyPhotoUrl) {
      images.push(weddingData.family.groomFamily.familyPhotoUrl);
    }
    
    return images.filter(Boolean);
  }, [weddingData]);

  // Preload critical images
  const { isLoading: imagesLoading } = useImagePreloader(criticalImages);

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
    criticalImagesCount: criticalImages.length
  };
};