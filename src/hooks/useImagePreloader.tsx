import { useEffect, useState } from 'react';

interface PreloadedImages {
  [url: string]: boolean;
}

export const useImagePreloader = (urls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<PreloadedImages>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!urls.length) {
      setIsLoading(false);
      return;
    }

    const preloadImages = async () => {
      const promises = urls.map((url) => {
        return new Promise<void>((resolve) => {
          if (!url) {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => ({ ...prev, [url]: true }));
            resolve();
          };
          img.onerror = () => {
            resolve(); // Resolve even on error to not block other images
          };
          img.src = url;
        });
      });

      await Promise.all(promises);
      setIsLoading(false);
    };

    preloadImages();
  }, [urls]);

  return { loadedImages, isLoading };
};

// Hook for preloading critical images
export const useCriticalImagePreloader = (
  couplePhoto: string,
  familyPhotos: string[],
  galleryPhotos: string[]
) => {
  const criticalUrls = [
    couplePhoto,
    ...familyPhotos.filter(Boolean),
    ...galleryPhotos.slice(0, 3).filter(Boolean) // First 3 gallery photos
  ].filter(Boolean);

  return useImagePreloader(criticalUrls);
};