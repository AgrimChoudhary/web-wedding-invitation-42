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
  wishesEnabled?: boolean;
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
  const [wishesEnabled, setWishesEnabled] = useState<boolean | undefined>(undefined);

  // Track if we're in platform mode (iframe with platform data)
  const isPlatformMode = Boolean(platformData?.eventId || lastMessage);

  // Initialize platform data from URL params and send TEMPLATE_READY
  useEffect(() => {
    if (urlPlatformData) {
      // Allow URL status parameters to work
      const platformData = {
        ...urlPlatformData,
        // Use status from URL parameters if available
        guestStatus: urlPlatformData.guestStatus || 'invited',
        hasResponded: urlPlatformData.hasResponded || false,
        accepted: urlPlatformData.accepted || false
      };
      
      console.log('✅ Allowing status from URL parameters:', {
        original: { hasResponded: urlPlatformData.hasResponded, accepted: urlPlatformData.accepted, guestStatus: urlPlatformData.guestStatus },
        final: { hasResponded: platformData.hasResponded, accepted: platformData.accepted, guestStatus: platformData.guestStatus }
      });
      
      setPlatformData(platformData);
      // Send TEMPLATE_READY with eventId and guestId if available
      sendTemplateReady(platformData.eventId, platformData.guestId);
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
        const payload: any = (lastMessage as any).payload ?? (lastMessage as any).data;
        
        // Update RSVP state from platform
        setRsvpStatus(payload.status === 'pending' ? null : payload.status);
        setShowSubmitButton(payload.showSubmitButton);
        setShowEditButton(payload.showEditButton);
        setRsvpFields(payload.rsvpFields || []);
        setExistingRsvpData(payload.existingRsvpData);
        if (typeof payload.wishesEnabled === 'boolean') {
          setWishesEnabled(payload.wishesEnabled);
        }
        
        // Map platform status to template guestStatus
        const mappedGuestStatus: 'invited' | 'accepted' | 'submitted' = (() => {
          switch (payload.status) {
            case 'submitted':
              return 'submitted';
            case 'accepted':
              return 'accepted';
            case 'viewed':
            case 'pending':
            default:
              return 'invited';
          }
        })();

        // Update platform data with platform-provided status
        const newPlatformData: PlatformData = {
          eventId: payload.eventId,
          guestId: payload.guestId,
          guestName: payload.platformData.guestName,
          // Mark responded only when fully submitted
          hasResponded: mappedGuestStatus === 'submitted',
          guestStatus: mappedGuestStatus,
          // Preserve RSVP type from URL params; do not infer from fields
          rsvpConfig: (platformData?.rsvpConfig as 'simple' | 'detailed') || 'simple',
          existingRsvpData: payload.existingRsvpData,
          customFields: payload.rsvpFields,
          wishesEnabled: typeof payload.wishesEnabled === 'boolean' ? payload.wishesEnabled : platformData?.wishesEnabled
        };
        
        console.log('✅ PostMessage - Setting status from platform:', {
          payloadStatus: payload.status,
          finalGuestStatus: newPlatformData.guestStatus,
          hasResponded: newPlatformData.hasResponded
        });
        
        setPlatformData(newPlatformData);
        
        // Map event details to wedding data if available
        if (payload?.eventDetails) {
          // Preserve previously parsed family data from URL if eventDetails doesn't provide it
          const existingStructuredFamily = (platformData as any)?.structuredData?.weddingData?.family;
          const preservedBrideFamily = existingStructuredFamily?.bride_family;
          const preservedGroomFamily = existingStructuredFamily?.groom_family;

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
                bride_family: preservedBrideFamily || { family_photo: '', parents_name: '', members: [] },
                groom_family: preservedGroomFamily || { family_photo: '', parents_name: '', members: [] }
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
        setRsvpStatus((() => {
          switch (data.status) {
            case 'submitted':
              return 'submitted';
            case 'accepted':
              return 'accepted';
            default:
              return null;
          }
        })());
        setShowSubmitButton(data.showSubmitButton);
        setShowEditButton(data.showEditButton);
        setRsvpFields(data.rsvpFields || []);
        setExistingRsvpData(data.existingRsvpData);
        if (typeof (data as any).wishesEnabled === 'boolean') {
          setWishesEnabled((data as any).wishesEnabled);
        }
        
        // Map and update guestStatus based on incoming payload updates
        if (platformData) {
          const mappedGuestStatus: 'invited' | 'accepted' | 'submitted' = (() => {
            switch (data.status) {
              case 'submitted':
                return 'submitted';
              case 'accepted':
                return 'accepted';
              default:
                return 'invited';
            }
          })();

          const updatedPlatformData = {
            ...platformData,
            guestStatus: mappedGuestStatus,
            hasResponded: mappedGuestStatus === 'submitted',
            existingRsvpData: data.existingRsvpData,
            // Preserve RSVP type previously parsed from URL
            rsvpConfig: (platformData.rsvpConfig as 'simple' | 'detailed') || platformData.rsvpConfig,
            wishesEnabled: typeof (data as any).wishesEnabled === 'boolean' ? (data as any).wishesEnabled : platformData.wishesEnabled
          };

          console.log('✅ INVITATION_PAYLOAD_UPDATE - Setting status from platform:', {
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
    wishesEnabled: wishesEnabled ?? platformData?.wishesEnabled,
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