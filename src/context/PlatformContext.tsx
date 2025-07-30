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
  guestStatus: 'pending' | 'viewed' | 'accepted' | 'submitted';
  existingRsvpData: Record<string, any> | null;
  rsvpConfig: 'simple' | 'detailed';
  sendRSVP: (rsvpData?: any) => void;
  sendRSVPUpdate: (rsvpData: any) => void;
  markAsViewed: () => void;
  sendInvitationViewed: () => void;
  trackInvitationViewed: (duration: number) => void;
  // V2 Platform flags
  canSubmitRSVP: boolean;
  canEditRSVP: boolean;
  rsvpClosed: boolean;
  deadlineMessage: string | null;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { platformData: urlPlatformData, isLoading: urlLoading, error: urlError } = useUrlParams();
  const { 
    lastMessage, 
    sendRSVPAccepted, 
    sendRSVPUpdated,
    sendInvitationViewed,
    sendInvitationViewedWithDuration 
  } = usePostMessage();
  
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
        
        // Extract platform data from postMessage
        const messageData = lastMessage.data;
        
        // Update platform data with comprehensive data from platform
        if (platformData) {
          const updatedData: PlatformData = {
            ...platformData,
            // Extract V2 platform flags
            canSubmitRSVP: messageData.canSubmitRSVP || false,
            canEditRSVP: messageData.canEditRSVP || false,
            rsvpClosed: messageData.rsvpClosed || false,
            deadlineMessage: messageData.deadlineMessage || null,
            // Extract RSVP config
            rsvpConfig: messageData.event?.rsvp_config?.type === 'simple' ? 'simple' : 'detailed',
            // Extract guest status
            guestStatus: messageData.guestStatus || 'pending',
            // Extract existing RSVP data
            existingRsvpData: messageData.existingRsvpData || null
          };
          
          setPlatformData(updatedData);
          console.log('Platform data updated with LOAD_INVITATION_DATA:', updatedData);
        }
        
        console.log('=== END PROCESSING LOAD_INVITATION_DATA ===');
      } catch (err) {
        console.error('Error processing LOAD_INVITATION_DATA:', err);
      }
    } else if (lastMessage.type === 'STATUS_UPDATE') {
      try {
        console.log('=== PROCESSING STATUS_UPDATE ===');
        console.log('Status update data:', lastMessage.data);
        
        // Update platform data with new status and flags
        if (platformData) {
          const updatedData: PlatformData = {
            ...platformData,
            guestStatus: lastMessage.data.newStatus,
            canSubmitRSVP: lastMessage.data.canSubmitRSVP,
            canEditRSVP: lastMessage.data.canEditRSVP,
            rsvpClosed: lastMessage.data.rsvpClosed || false,
            deadlineMessage: lastMessage.data.deadlineMessage || null
          };
          
          setPlatformData(updatedData);
          console.log('Platform data updated with STATUS_UPDATE:', updatedData);
        }
        
        console.log('=== END PROCESSING STATUS_UPDATE ===');
      } catch (err) {
        console.error('Error processing STATUS_UPDATE:', err);
      }
    }
  }, [lastMessage]);

  // RSVP handler (for initial acceptance)
  const sendRSVP = (rsvpData?: any) => {
    if (isPlatformMode) {
      console.log('Sending RSVP acceptance to platform:', rsvpData || {});
      sendRSVPAccepted(rsvpData || {});
      // Don't update local state immediately - wait for STATUS_UPDATE from platform
    } else {
      console.log('RSVP sent (standalone mode):', rsvpData);
      // In standalone mode, update local state directly
      if (platformData) {
        const newStatus = rsvpData && Object.keys(rsvpData).length > 0 ? 'submitted' : 'accepted';
        setPlatformData({
          ...platformData,
          guestStatus: newStatus,
          existingRsvpData: rsvpData || platformData.existingRsvpData
        });
      }
    }
  };

  // RSVP update handler (for editing existing RSVP)
  const sendRSVPUpdate = (rsvpData: any) => {
    if (isPlatformMode) {
      sendRSVPUpdated(rsvpData);
    } else {
      console.log('RSVP updated (standalone mode):', rsvpData);
    }
    
    // Update local platform data state
    if (platformData) {
      setPlatformData({
        ...platformData,
        guestStatus: 'submitted',
        existingRsvpData: rsvpData
      });
    }
  };

  // Mark invitation as viewed
  const markAsViewed = () => {
    if (isPlatformMode) {
      sendInvitationViewed();
    } else {
      console.log('Invitation marked as viewed (standalone mode)');
    }
    
    // Update local platform data state
    if (platformData && platformData.guestStatus === 'pending') {
      setPlatformData({
        ...platformData,
        guestStatus: 'viewed'
      });
    }
  };

  // Analytics handler (legacy)
  const trackInvitationViewed = (duration: number) => {
    if (isPlatformMode) {
      sendInvitationViewedWithDuration(duration);
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
    guestStatus: platformData?.guestStatus || 'pending',
    existingRsvpData: platformData?.existingRsvpData || null,
    rsvpConfig: platformData?.rsvpConfig || 'simple',
    sendRSVP,
    sendRSVPUpdate,
    markAsViewed,
    sendInvitationViewed,
    trackInvitationViewed,
    // V2 Platform flags
    canSubmitRSVP: platformData?.canSubmitRSVP || false,
    canEditRSVP: platformData?.canEditRSVP || false,
    rsvpClosed: platformData?.rsvpClosed || false,
    deadlineMessage: platformData?.deadlineMessage || null
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