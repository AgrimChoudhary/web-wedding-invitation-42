import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUrlParams } from '../hooks/useUrlParams';
import { usePostMessage } from '../hooks/usePostMessage';
import { mapPlatformDataToWeddingData, validatePlatformData } from '../utils/dataMapper';
import { WeddingData } from '../types/wedding';
import { PlatformData } from '../types/platform';

interface PlatformContextType {
  platformData: PlatformData | null;
  weddingData: WeddingData | null;
  isLoading: boolean;
  error: string | null;
  isPlatformMode: boolean;
  hasResponded: boolean;
  rsvpConfig: 'simple' | 'detailed';
  sendRSVP: (rsvpData?: { attendees?: number; dietary_requirements?: string; special_requests?: string }) => void;
  trackInvitationViewed: (duration: number) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { platformData: urlPlatformData, isLoading: urlLoading, error: urlError } = useUrlParams();
  const { lastMessage, sendRSVPAccepted, sendInvitationViewed } = usePostMessage();
  
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if we're in platform mode (iframe with platform data)
  const isPlatformMode = Boolean(platformData?.eventId || lastMessage);

  // Initialize platform data from URL params
  useEffect(() => {
    if (urlPlatformData) {
      setPlatformData(urlPlatformData);
    }
  }, [urlPlatformData]);

  // Process platform data and convert to wedding data
  useEffect(() => {
    if (urlLoading) return;

    if (urlError) {
      setError(urlError);
      setIsLoading(false);
      return;
    }

    // Process URL parameter data
    if (platformData?.structuredData) {
      try {
        if (validatePlatformData(platformData.structuredData)) {
          const mappedData = mapPlatformDataToWeddingData(platformData.structuredData);
          setWeddingData(mappedData);
          console.log('Platform data successfully mapped to wedding data');
        } else {
          console.warn('Invalid platform data structure, falling back to static data');
        }
      } catch (err) {
        console.error('Error mapping platform data:', err);
        setError('Failed to process platform data');
      }
    }

    setIsLoading(false);
  }, [platformData, urlLoading, urlError]);

  // Process PostMessage data
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'WEDDING_DATA_TRANSFER') {
      try {
        const messageData = lastMessage.data;
        if (validatePlatformData(messageData)) {
          const mappedData = mapPlatformDataToWeddingData(messageData);
          setWeddingData(mappedData);
          console.log('PostMessage wedding data successfully processed');
        }
      } catch (err) {
        console.error('Error processing PostMessage data:', err);
      }
    } else if (lastMessage.type === 'LOAD_INVITATION_DATA') {
      try {
        console.log('=== PROCESSING LOAD_INVITATION_DATA ===');
        console.log('Full message data:', lastMessage.data);
        
        // Extract RSVP config from postMessage
        if (lastMessage.data?.event?.rsvp_config) {
          const newRsvpConfig: 'simple' | 'detailed' = lastMessage.data.event.rsvp_config.type === 'simple' ? 'simple' : 'detailed';
          console.log('Updating RSVP config from postMessage:', newRsvpConfig);
          
          // Update platform data with new RSVP config
          if (platformData) {
            const updatedData: PlatformData = {
              ...platformData,
              rsvpConfig: newRsvpConfig
            };
            setPlatformData(updatedData);
            console.log('Platform data updated with new RSVP config:', updatedData);
          }
        }
        
        console.log('=== END PROCESSING LOAD_INVITATION_DATA ===');
      } catch (err) {
        console.error('Error processing LOAD_INVITATION_DATA:', err);
      }
    }
  }, [lastMessage]);

  // RSVP handler
  const sendRSVP = (rsvpData?: { attendees?: number; dietary_requirements?: string; special_requests?: string }) => {
    if (isPlatformMode) {
      sendRSVPAccepted(rsvpData || {});
    } else {
      console.log('RSVP sent (standalone mode):', rsvpData);
    }
  };

  // Analytics handler
  const trackInvitationViewed = (duration: number) => {
    if (isPlatformMode) {
      sendInvitationViewed(duration);
    } else {
      console.log('Invitation viewed (standalone mode):', duration);
    }
  };

  const value: PlatformContextType = {
    platformData,
    weddingData,
    isLoading,
    error,
    isPlatformMode,
    hasResponded: Boolean(platformData?.hasResponded),
    rsvpConfig: platformData?.rsvpConfig || 'simple',
    sendRSVP,
    trackInvitationViewed
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};