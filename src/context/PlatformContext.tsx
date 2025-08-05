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
  guestStatus: 'invited' | 'accepted' | 'submitted';
  existingRsvpData: Record<string, any> | null;
  rsvpConfig: 'simple' | 'detailed';
  showSubmitButton: boolean;
  showEditButton: boolean;
  rsvpFields: Array<any>;
  sendRSVP: (rsvpData?: any) => void;
  sendRSVPSubmitted: (rsvpData: Record<string, any>) => void;
  sendRSVPUpdated: (rsvpData: Record<string, any>) => void;
  trackInvitationViewed: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { platformData: urlPlatformData, isLoading: urlLoading, error: urlError } = useUrlParams();
  const { 
    lastMessage, 
    sendRSVPAccepted, 
    sendRSVPSubmitted, 
    sendRSVPUpdated, 
    sendInvitationViewed,
    sendTemplateReady
  } = usePostMessage();
  
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Platform-controlled RSVP state
  const [rsvpStatus, setRsvpStatus] = useState<null | "accepted" | "submitted">(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [rsvpFields, setRsvpFields] = useState<Array<any>>([]);
  const [existingRsvpData, setExistingRsvpData] = useState<Record<string, any> | null>(null);

  // Track if we're in platform mode (iframe with platform data)
  const isPlatformMode = Boolean(platformData?.eventId || lastMessage);

  // Initialize platform data from URL params and send TEMPLATE_READY
  useEffect(() => {
    if (urlPlatformData) {
      // Prevent automatic acceptance from URL parameters
      // This ensures that guests must explicitly click "Accept Invitation" 
      // rather than having their RSVP automatically accepted from URL parameters
      const safePlatformData = {
        ...urlPlatformData,
        // Always start with 'invited' status, regardless of URL parameters
        guestStatus: 'invited' as const,
        // Don't auto-accept from URL parameters
        hasResponded: false,
        accepted: false
      };
      
      console.log('🛡️ Preventing automatic acceptance from URL parameters:', {
        original: { hasResponded: urlPlatformData.hasResponded, accepted: urlPlatformData.accepted, guestStatus: urlPlatformData.guestStatus },
        safe: { hasResponded: safePlatformData.hasResponded, accepted: safePlatformData.accepted, guestStatus: safePlatformData.guestStatus }
      });
      
      setPlatformData(safePlatformData);
      // Send TEMPLATE_READY with eventId and guestId if available
      sendTemplateReady(safePlatformData.eventId, safePlatformData.guestId);
    } else {
      // Send TEMPLATE_READY without IDs for standalone mode
      sendTemplateReady();
    }
  }, [urlPlatformData, sendTemplateReady]);

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

    if (lastMessage.type === 'INVITATION_LOADED') {
      try {
        console.log('=== PROCESSING INVITATION_LOADED ===');
        const payload = lastMessage.payload;
        
        // Update RSVP state from platform
        setRsvpStatus(payload.status);
        setShowSubmitButton(payload.showSubmitButton);
        setShowEditButton(payload.showEditButton);
        setRsvpFields(payload.rsvpFields || []);
        setExistingRsvpData(payload.existingRsvpData);
        
        // Update platform data - Don't auto-accept from platform data
        const newPlatformData: PlatformData = {
          eventId: payload.eventId,
          guestId: payload.guestId,
          guestName: payload.platformData.guestName,
          // Only mark as responded if it's 'submitted', not 'accepted' from platform
          hasResponded: payload.status === 'submitted',
          // Always start as 'invited' unless explicitly 'submitted' - prevent auto-acceptance
          guestStatus: payload.status === 'submitted' ? 'submitted' : 'invited',
          rsvpConfig: payload.rsvpFields.length > 0 ? 'detailed' : 'simple',
          existingRsvpData: payload.existingRsvpData,
          customFields: payload.rsvpFields
        };
        
        console.log('🛡️ PostMessage - Preventing automatic acceptance:', {
          payloadStatus: payload.status,
          finalGuestStatus: newPlatformData.guestStatus,
          hasResponded: newPlatformData.hasResponded
        });
        
        setPlatformData(newPlatformData);
        
        // Map event details to wedding data if available
        if (payload.eventDetails) {
          // Create a mock structured data to reuse existing mapper
          const mockStructuredData = {
            eventId: payload.eventId,
            eventName: 'Wedding',
            guestId: payload.guestId,
            guestName: payload.platformData.guestName,
            // Only mark as responded if it's 'submitted', not 'accepted' from platform
            hasResponded: payload.status === 'submitted',
            // Don't auto-accept from platform data - only if user explicitly accepts
            accepted: false,
            weddingData: {
              couple: {
                groomName: payload.eventDetails.groom_name,
                brideName: payload.eventDetails.bride_name,
                groomCity: '',
                brideCity: '',
                weddingDate: payload.eventDetails.wedding_date,
                weddingTime: payload.eventDetails.wedding_time,
                groomFirst: true,
                coupleImage: ''
              },
              venue: {
                name: payload.eventDetails.venue_name,
                address: payload.eventDetails.venue_address,
                mapLink: ''
              },
              family: {
                bride_family: { family_photo: '', parents_name: '', members: [] },
                groom_family: { family_photo: '', parents_name: '', members: [] }
              },
              contacts: [],
              gallery: payload.eventDetails.photos?.map((photo, index) => ({
                photo: photo.url,
                title: photo.caption || `Photo ${index + 1}`
              })) || [],
              events: payload.eventDetails.events?.map(event => ({
                name: event.event_name,
                date: event.event_date,
                time: event.event_time,
                venue: event.venue_name,
                description: '',
                map_link: ''
              })) || []
            }
          };
          
          const mappedData = mapPlatformDataToWeddingData(mockStructuredData);
          setWeddingData(mappedData);
        }
        
        console.log('=== END PROCESSING INVITATION_LOADED ===');
      } catch (err) {
        console.error('Error processing INVITATION_LOADED:', err);
      }
    } else if (lastMessage.type === 'INVITATION_PAYLOAD_UPDATE') {
      try {
        console.log('=== PROCESSING INVITATION_PAYLOAD_UPDATE ===');
        const data = lastMessage.data;
        
        // Update RSVP state from platform
        setRsvpStatus(data.status);
        setShowSubmitButton(data.showSubmitButton);
        setShowEditButton(data.showEditButton);
        setRsvpFields(data.rsvpFields || []);
        setExistingRsvpData(data.existingRsvpData);
        
        // Update platform data - Don't auto-accept from platform data
        if (platformData) {
          const updatedPlatformData = {
            ...platformData,
            // Only set status if it's 'submitted', otherwise keep as 'invited' until user clicks
            guestStatus: (data.status === 'submitted' ? 'submitted' : 'invited') as 'invited' | 'accepted' | 'submitted',
            existingRsvpData: data.existingRsvpData
          };
          
          console.log('🛡️ INVITATION_PAYLOAD_UPDATE - Preventing automatic acceptance:', {
            dataStatus: data.status,
            finalGuestStatus: updatedPlatformData.guestStatus
          });
          
          setPlatformData(updatedPlatformData);
        }
        
        console.log('=== END PROCESSING INVITATION_PAYLOAD_UPDATE ===');
      } catch (err) {
        console.error('Error processing INVITATION_PAYLOAD_UPDATE:', err);
      }
    }
  }, [lastMessage]);

  // RSVP handlers
  const sendRSVP = (rsvpData?: any) => {
    console.log('🎯 sendRSVP called with:', { rsvpData, isPlatformMode, platformData });
    
    if (isPlatformMode && platformData?.eventId && platformData?.guestId) {
      if (rsvpData && Object.keys(rsvpData).length > 0) {
        // Send submitted with data
        console.log('📝 Sending RSVP submission with data');
        sendRSVPSubmitted(platformData.eventId, platformData.guestId, rsvpData);
      } else {
        // Send acceptance only
        console.log('🎉 Sending RSVP acceptance');
        sendRSVPAccepted(platformData.eventId, platformData.guestId);
      }
    } else {
      console.log('⚠️ RSVP sent (standalone mode or missing platform data):', rsvpData);
    }
    
    // Update local platform data state
    if (platformData) {
      const newStatus = rsvpData ? 'submitted' : 'accepted';
      setPlatformData({
        ...platformData,
        guestStatus: newStatus,
        existingRsvpData: rsvpData || platformData.existingRsvpData
      });
    }
  };

  const sendRSVPSubmittedHandler = (rsvpData: Record<string, any>) => {
    console.log('📝 sendRSVPSubmittedHandler called');
    if (isPlatformMode && platformData?.eventId && platformData?.guestId) {
      sendRSVPSubmitted(platformData.eventId, platformData.guestId, rsvpData);
    } else {
      console.log('⚠️ Cannot send RSVP_SUBMITTED: missing platform data');
    }
  };

  const sendRSVPUpdatedHandler = (rsvpData: Record<string, any>) => {
    console.log('✏️ sendRSVPUpdatedHandler called');
    if (isPlatformMode && platformData?.eventId && platformData?.guestId) {
      sendRSVPUpdated(platformData.eventId, platformData.guestId, rsvpData);
    } else {
      console.log('⚠️ Cannot send RSVP_UPDATED: missing platform data');
    }
  };

  // Analytics handler
  const trackInvitationViewedHandler = () => {
    console.log('👀 trackInvitationViewedHandler called');
    if (isPlatformMode && platformData?.eventId && platformData?.guestId) {
      sendInvitationViewed(platformData.eventId, platformData.guestId);
    } else {
      console.log('⚠️ Invitation viewed (standalone mode or missing platform data)');
    }
  };

  const value: PlatformContextType = {
    platformData,
    weddingData,
    isLoading,
    error,
    isPlatformMode,
    // Only mark as responded if user has explicitly submitted RSVP data
    hasResponded: Boolean(platformData?.guestStatus === 'submitted'),
    guestStatus: platformData?.guestStatus || 'invited',
    existingRsvpData: existingRsvpData || platformData?.existingRsvpData || null,
    rsvpConfig: platformData?.rsvpConfig || 'simple',
    showSubmitButton,
    showEditButton,
    rsvpFields,
    sendRSVP,
    sendRSVPSubmitted: sendRSVPSubmittedHandler,
    sendRSVPUpdated: sendRSVPUpdatedHandler,
    trackInvitationViewed: trackInvitationViewedHandler
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