import { useState, useEffect, useCallback } from 'react';

interface ImageMetrics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  totalLoadTime: number;
  loadProgress: number;
  criticalPathComplete: boolean;
}

interface ImageLoadData {
  url: string;
  loadTime: number;
  isCritical: boolean;
  timestamp: number;
}

export const useImageMetrics = () => {
  const [metrics, setMetrics] = useState<ImageMetrics>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalLoadTime: 0,
    loadProgress: 0,
    criticalPathComplete: false
  });

  const [loadData, setLoadData] = useState<ImageLoadData[]>([]);
  const [criticalImages, setCriticalImages] = useState<Set<string>>(new Set());

  const trackImageLoad = useCallback((url: string, loadTime: number, isCritical = false) => {
    const newLoadData: ImageLoadData = {
      url,
      loadTime,
      isCritical,
      timestamp: Date.now()
    };

    setLoadData(prev => [...prev, newLoadData]);

    if (isCritical) {
      setCriticalImages(prev => new Set([...prev, url]));
    }
  }, []);

  const trackImageError = useCallback((url: string) => {
    setMetrics(prev => ({
      ...prev,
      failedImages: prev.failedImages + 1
    }));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      totalLoadTime: 0,
      loadProgress: 0,
      criticalPathComplete: false
    });
    setLoadData([]);
    setCriticalImages(new Set());
  }, []);

  // Update metrics when load data changes
  useEffect(() => {
    if (loadData.length === 0) return;

    const totalLoadTime = loadData.reduce((sum, data) => sum + data.loadTime, 0);
    const averageLoadTime = totalLoadTime / loadData.length;
    const criticalImageUrls = loadData.filter(data => data.isCritical).map(data => data.url);
    const criticalPathComplete = criticalImageUrls.length > 0 && 
      criticalImageUrls.every(url => loadData.some(data => data.url === url));

    setMetrics(prev => ({
      ...prev,
      loadedImages: loadData.length,
      averageLoadTime,
      totalLoadTime,
      loadProgress: prev.totalImages > 0 ? (loadData.length / prev.totalImages) * 100 : 0,
      criticalPathComplete
    }));
  }, [loadData]);

  const setTotalImages = useCallback((total: number) => {
    setMetrics(prev => ({
      ...prev,
      totalImages: total,
      loadProgress: prev.loadedImages > 0 ? (prev.loadedImages / total) * 100 : 0
    }));
  }, []);

  const getPerformanceReport = useCallback(() => {
    const criticalData = loadData.filter(data => data.isCritical);
    const nonCriticalData = loadData.filter(data => !data.isCritical);

    return {
      overall: metrics,
      critical: {
        count: criticalData.length,
        averageLoadTime: criticalData.length > 0 
          ? criticalData.reduce((sum, data) => sum + data.loadTime, 0) / criticalData.length 
          : 0,
        maxLoadTime: criticalData.length > 0 
          ? Math.max(...criticalData.map(data => data.loadTime)) 
          : 0
      },
      nonCritical: {
        count: nonCriticalData.length,
        averageLoadTime: nonCriticalData.length > 0 
          ? nonCriticalData.reduce((sum, data) => sum + data.loadTime, 0) / nonCriticalData.length 
          : 0
      },
      recommendations: generateRecommendations(metrics, loadData)
    };
  }, [metrics, loadData]);

  return {
    metrics,
    trackImageLoad,
    trackImageError,
    resetMetrics,
    setTotalImages,
    getPerformanceReport
  };
};

const generateRecommendations = (metrics: ImageMetrics, loadData: ImageLoadData[]) => {
  const recommendations: string[] = [];

  if (metrics.averageLoadTime > 2000) {
    recommendations.push('Consider image compression or CDN optimization');
  }

  if (metrics.failedImages > 0) {
    recommendations.push('Implement fallback images for failed loads');
  }

  const slowImages = loadData.filter(data => data.loadTime > 3000);
  if (slowImages.length > 0) {
    recommendations.push(`${slowImages.length} images loading slowly (>3s)`);
  }

  if (!metrics.criticalPathComplete && loadData.length > 5) {
    recommendations.push('Prioritize critical image loading');
  }

  return recommendations;
};