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

  // Process PostMessage data with enhanced INVITATION_LOADED handling
  useEffect(() => {
    if (!lastMessage) return;

    console.log('[PLATFORM CONTEXT] 📨 Processing message:', lastMessage.type);

    if (lastMessage.type === 'WEDDING_DATA_TRANSFER') {
      try {
        const messageData = lastMessage.data;
        if (validatePlatformData(messageData)) {
          const mappedData = mapPlatformDataToWeddingData(messageData);
          setWeddingData(mappedData);
          console.log('[PLATFORM CONTEXT] ✅ PostMessage wedding data successfully processed');
        }
      } catch (err) {
        console.error('[PLATFORM CONTEXT] ❌ Error processing PostMessage data:', err);
      }
    } else if (lastMessage.type === 'LOAD_INVITATION_DATA') {
      try {
        console.log('[PLATFORM CONTEXT] === PROCESSING LOAD_INVITATION_DATA ===');
        console.log('[PLATFORM CONTEXT] Full message data:', lastMessage.data);
        
        // Extract RSVP config from postMessage
        if (lastMessage.data?.event?.rsvp_config) {
          const newRsvpConfig: 'simple' | 'detailed' = lastMessage.data.event.rsvp_config.type === 'simple' ? 'simple' : 'detailed';
          console.log('[PLATFORM CONTEXT] 🔄 Updating RSVP config from postMessage:', newRsvpConfig);
          
          // Update platform data with new RSVP config
          if (platformData) {
            const updatedData: PlatformData = {
              ...platformData,
              rsvpConfig: newRsvpConfig
            };
            setPlatformData(updatedData);
            console.log('[PLATFORM CONTEXT] ✅ Platform data updated with new RSVP config:', updatedData);
          }
        }
        
        console.log('[PLATFORM CONTEXT] === END PROCESSING LOAD_INVITATION_DATA ===');
      } catch (err) {
        console.error('[PLATFORM CONTEXT] ❌ Error processing LOAD_INVITATION_DATA:', err);
      }
    } else if (lastMessage.type === 'INVITATION_LOADED') {
      try {
        console.log('[PLATFORM CONTEXT] 🎯 === PROCESSING INVITATION_LOADED ===');
        console.log('[PLATFORM CONTEXT] 📊 Complete INVITATION_LOADED data:', lastMessage.data);
        
        // Extract comprehensive platform data from INVITATION_LOADED message
        const messageData = lastMessage.data;
        
        // Create updated platform data with all RSVP flags
        const updatedPlatformData: PlatformData = {
          ...platformData,
          
          // Basic identifiers
          eventId: messageData.eventId || platformData?.eventId,
          guestId: messageData.guestId || platformData?.guestId,
          guestName: messageData.guestName || platformData?.guestName,
          eventName: messageData.eventName || platformData?.eventName,
          
          // Enhanced RSVP status
          guestStatus: messageData.guestStatus || platformData?.guestStatus || 'pending',
          hasResponded: messageData.hasResponded ?? platformData?.hasResponded ?? false,
          accepted: messageData.accepted ?? platformData?.accepted ?? false,
          viewed: messageData.viewed ?? platformData?.viewed ?? false,
          custom_fields_submitted: messageData.custom_fields_submitted ?? platformData?.custom_fields_submitted ?? false,
          
          // CRITICAL: UI control flags from platform
          canSubmitRsvp: messageData.canSubmitRsvp ?? platformData?.canSubmitRsvp ?? false,
          canEditRsvp: messageData.canEditRsvp ?? platformData?.canEditRsvp ?? false,
          showSubmitButton: messageData.showSubmitButton ?? platformData?.showSubmitButton ?? false,
          showEditButton: messageData.showEditButton ?? platformData?.showEditButton ?? false,
          
          // RSVP configuration
          rsvpConfig: messageData.rsvpConfig || platformData?.rsvpConfig || 'simple',
          hasCustomFields: messageData.hasCustomFields ?? platformData?.hasCustomFields ?? false,
          allowEditAfterSubmit: messageData.allowEditAfterSubmit ?? platformData?.allowEditAfterSubmit ?? false,
          
          // RSVP data
          rsvpData: messageData.rsvpData || messageData.existingRsvpData || platformData?.rsvpData,
          existingRsvpData: messageData.existingRsvpData || messageData.rsvpData || platformData?.existingRsvpData,
          
          // Custom fields
          customFields: messageData.customFields || platformData?.customFields || [],
          
          // Timestamps
          viewed_at: messageData.viewed_at || platformData?.viewed_at,
          accepted_at: messageData.accepted_at || platformData?.accepted_at,
          custom_fields_submitted_at: messageData.custom_fields_submitted_at || platformData?.custom_fields_submitted_at,
          
          // Legacy compatibility
          guestViewed: messageData.guestViewed ?? messageData.viewed ?? platformData?.guestViewed ?? false,
          guestAccepted: messageData.guestAccepted ?? messageData.accepted ?? platformData?.guestAccepted ?? false
        };
        
        console.log('[PLATFORM CONTEXT] 🔄 Updating platform data with INVITATION_LOADED:', {
          before: platformData,
          after: updatedPlatformData,
          keyFlags: {
            guestStatus: updatedPlatformData.guestStatus,
            canSubmitRsvp: updatedPlatformData.canSubmitRsvp,
            canEditRsvp: updatedPlatformData.canEditRsvp,
            showSubmitButton: updatedPlatformData.showSubmitButton,
            showEditButton: updatedPlatformData.showEditButton
          }
        });
        
        setPlatformData(updatedPlatformData);
        console.log('[PLATFORM CONTEXT] ✅ Platform data successfully updated from INVITATION_LOADED');
        console.log('[PLATFORM CONTEXT] === END PROCESSING INVITATION_LOADED ===');
        
      } catch (err) {
        console.error('[PLATFORM CONTEXT] ❌ Error processing INVITATION_LOADED:', err);
      }
    }
  }, [lastMessage, platformData]);

  // RSVP handler with enhanced logging and proper platform flag updates
  const sendRSVP = (rsvpData?: any) => {
    console.log('[PLATFORM CONTEXT] 🎯 === SENDING RSVP ===');
    console.log('[PLATFORM CONTEXT] 📊 Current state:', {
      isPlatformMode,
      hasRsvpData: !!rsvpData,
      rsvpDataKeys: rsvpData ? Object.keys(rsvpData) : [],
      currentGuestStatus: platformData?.guestStatus,
      currentFlags: {
        canSubmitRsvp: platformData?.canSubmitRsvp,
        canEditRsvp: platformData?.canEditRsvp,
        showSubmitButton: platformData?.showSubmitButton,
        showEditButton: platformData?.showEditButton
      }
    });
    
    if (isPlatformMode) {
      // Send only the RSVP data without adding guestStatus field
      sendRSVPAccepted(rsvpData || {});
      console.log('[PLATFORM CONTEXT] ✅ RSVP sent to platform via postMessage');
      
      // CRITICAL: In platform mode, let the platform update our state via INVITATION_LOADED message
      // Don't update local state immediately - wait for platform response
      console.log('[PLATFORM CONTEXT] ⏳ Waiting for platform to send updated state via INVITATION_LOADED...');
      
    } else {
      console.log('[PLATFORM CONTEXT] 🔧 RSVP sent (standalone mode):', rsvpData);
      
      // Only update local state in standalone mode
      if (platformData) {
        const newStatus: 'pending' | 'viewed' | 'accepted' | 'submitted' = rsvpData ? 'submitted' : 'accepted';
        const updatedData = {
          ...platformData,
          guestStatus: newStatus,
          existingRsvpData: rsvpData || platformData.existingRsvpData,
          // Update button flags for standalone mode
          showSubmitButton: newStatus === 'accepted' && !rsvpData,
          showEditButton: newStatus === 'submitted' && !!rsvpData,
          canSubmitRsvp: newStatus === 'accepted',
          canEditRsvp: newStatus === 'submitted'
        };
        setPlatformData(updatedData);
        console.log('[PLATFORM CONTEXT] 📝 Updated standalone platform data:', updatedData);
      }
    }
    
    console.log('[PLATFORM CONTEXT] === END SENDING RSVP ===');
  };

  // Analytics handler with enhanced logging
  const trackInvitationViewed = (duration: number) => {
    console.log('[PLATFORM CONTEXT] 👁️ Tracking invitation view...');
    console.log('[PLATFORM CONTEXT] Platform mode:', isPlatformMode);
    console.log('[PLATFORM CONTEXT] View duration:', duration);
    
    if (isPlatformMode) {
      sendInvitationViewed(duration);
      console.log('[PLATFORM CONTEXT] ✅ Analytics sent to platform');
      
      // Update guest status to 'viewed' if still pending
      if (platformData?.guestStatus === 'pending') {
        setPlatformData({
          ...platformData,
          guestStatus: 'viewed'
        });
        console.log('[PLATFORM CONTEXT] 📝 Updated guest status to "viewed"');
      }
    } else {
      console.log('[PLATFORM CONTEXT] 🔧 Invitation viewed (standalone mode):', duration);
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
    existingRsvpData: platformData?.existingRsvpData || platformData?.rsvpData || null,
    rsvpConfig: typeof platformData?.rsvpConfig === 'string' ? platformData.rsvpConfig : platformData?.rsvpConfig?.type || 'simple',
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