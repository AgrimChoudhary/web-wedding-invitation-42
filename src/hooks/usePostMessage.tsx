import { useEffect, useState, useCallback } from 'react';
import { PlatformMessage, TemplateMessage } from '../types/messages';

const ALLOWED_ORIGINS = [
  'https://utsavy2.vercel.app',
  'https://platform-domain.com', // Replace with actual platform domain
  window.location.origin
];

export const usePostMessage = () => {
  const [lastMessage, setLastMessage] = useState<PlatformMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [currentGuestId, setCurrentGuestId] = useState<string | null>(null);

  // Send message to platform
  const sendMessageToPlatform = useCallback((message: TemplateMessage) => {
    try {
      // Send to parent window (platform iframe container)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
        console.log('Sent message to platform:', message);
      } else {
        console.warn('No parent window found, running standalone');
      }
    } catch (error) {
      console.error('Error sending message to platform:', error);
    }
  }, []);

  // Listen for messages from platform
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn('Message from unauthorized origin:', event.origin);
        return;
      }

      try {
        const message = event.data as PlatformMessage;
        
        // Validate message structure
        if (!message.type || !message.timestamp || message.source !== 'PLATFORM') {
          console.warn('Invalid message structure:', message);
          return;
        }

        console.log('Received platform message:', message);
        setLastMessage(message);
        setIsConnected(true);
        
        // Handle specific message types
        if (message.type === 'WEDDING_DATA_TRANSFER') {
          console.log('Wedding data received:', message.data);
        } else if (message.type === 'INVITATION_LOADED') {
          console.log('Invitation loaded:', message.data);
          // Store eventId and guestId for security
          if (message.data.eventId) setCurrentEventId(message.data.eventId);
          if (message.data.guestId) setCurrentGuestId(message.data.guestId);
        } else if (message.type === 'LOAD_INVITATION_DATA') {
          console.log('=== LOAD_INVITATION_DATA RECEIVED ===');
          console.log('Full message data:', message.data);
          
          // Extract eventId and guestId from LOAD_INVITATION_DATA
          if (message.data?.event?.id) setCurrentEventId(message.data.event.id);
          if (message.data?.guest?.id) setCurrentGuestId(message.data.guest.id);
          
          if (message.data?.event?.rsvp_config) {
            console.log('RSVP Config from postMessage:', message.data.event.rsvp_config);
            console.log('RSVP Type:', message.data.event.rsvp_config.type);
          }
          
          console.log('=== END LOAD_INVITATION_DATA ===');
        } else if (message.type === 'STATUS_UPDATE') {
          console.log('Status update received:', message.data);
        }
        
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Send ready signal to platform
    const readyMessage: TemplateMessage = {
      type: 'TEMPLATE_READY',
      data: { templateVersion: '1.0' },
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    sendMessageToPlatform(readyMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sendMessageToPlatform]);

  // Send RSVP acceptance
  const sendRSVPAccepted = useCallback((rsvpData: Record<string, any> = {}) => {
    if (!currentEventId || !currentGuestId) {
      console.error('Missing eventId or guestId for secure RSVP submission');
      return;
    }

    const messageData: any = { 
      guestId: currentGuestId,
      eventId: currentEventId,
      accepted: true 
    };
    
    // Only include rsvpData if there are actual values
    if (Object.keys(rsvpData).length > 0) {
      messageData.rsvpData = rsvpData;
    }
    
    const message: TemplateMessage = {
      type: 'RSVP_ACCEPTED',
      data: messageData,
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform, currentEventId, currentGuestId]);

  // Send RSVP update (for edit functionality)
  const sendRSVPUpdated = useCallback((rsvpData: Record<string, any>) => {
    if (!currentEventId || !currentGuestId) {
      console.error('Missing eventId or guestId for secure RSVP update');
      return;
    }

    const message: TemplateMessage = {
      type: 'RSVP_UPDATED',
      data: {
        guestId: currentGuestId,
        eventId: currentEventId,
        rsvpData,
        newStatus: 'submitted'
      },
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform, currentEventId, currentGuestId]);

  // Mark invitation as viewed
  const sendInvitationViewed = useCallback(() => {
    if (!currentEventId || !currentGuestId) {
      console.warn('Missing eventId or guestId for invitation viewed tracking');
      return;
    }

    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: {
        guestId: currentGuestId,
        eventId: currentEventId,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform, currentEventId, currentGuestId]);

  // Legacy function for backward compatibility
  const sendInvitationViewedWithDuration = useCallback((viewDuration: number) => {
    if (!currentEventId || !currentGuestId) {
      console.warn('Missing eventId or guestId for invitation viewed tracking');
      return;
    }

    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: {
        guestId: currentGuestId,
        eventId: currentEventId,
        timestamp: Date.now(),
        viewDuration
      },
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform, currentEventId, currentGuestId]);

  return {
    lastMessage,
    isConnected,
    sendRSVPAccepted,
    sendRSVPUpdated,
    sendInvitationViewed,
    sendInvitationViewedWithDuration,
    sendMessageToPlatform,
    currentEventId,
    currentGuestId
  };
};