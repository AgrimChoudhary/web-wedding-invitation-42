import { useState, useEffect } from 'react';

export type ConnectionSpeed = 'fast' | 'medium' | 'slow' | 'unknown';
export type EffectiveType = '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';

interface ConnectionInfo {
  connectionSpeed: ConnectionSpeed;
  effectiveType: EffectiveType;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export const useConnectionSpeed = (): ConnectionInfo => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    connectionSpeed: 'unknown',
    effectiveType: 'unknown'
  });

  useEffect(() => {
    const updateConnectionInfo = () => {
      // Check if the browser supports the Network Information API
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      if (connection) {
        const effectiveType = connection.effectiveType as EffectiveType;
        const downlink = connection.downlink;
        const rtt = connection.rtt;
        const saveData = connection.saveData;

        let speed: ConnectionSpeed = 'unknown';

        // Determine connection speed based on effective type and downlink
        if (effectiveType === '4g' && downlink > 1.5) {
          speed = 'fast';
        } else if (effectiveType === '4g' || (effectiveType === '3g' && downlink > 0.5)) {
          speed = 'medium';
        } else if (effectiveType === '3g' || effectiveType === '2g' || effectiveType === 'slow-2g') {
          speed = 'slow';
        }

        // Factor in save data preference
        if (saveData) {
          speed = speed === 'fast' ? 'medium' : 'slow';
        }

        setConnectionInfo({
          connectionSpeed: speed,
          effectiveType,
          downlink,
          rtt,
          saveData
        });
      } else {
        // Fallback: estimate based on timing
        const startTime = performance.now();
        const img = new Image();
        img.onload = () => {
          const loadTime = performance.now() - startTime;
          let speed: ConnectionSpeed = 'unknown';
          
          if (loadTime < 100) speed = 'fast';
          else if (loadTime < 300) speed = 'medium';
          else speed = 'slow';

          setConnectionInfo(prev => ({
            ...prev,
            connectionSpeed: speed
          }));
        };
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      }
    };

    updateConnectionInfo();

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      return () => connection.removeEventListener('change', updateConnectionInfo);
    }
  }, []);

  return connectionInfo;
};