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
        if (!message.type || !message.timestamp) {
          console.warn('Invalid message structure:', message);
          return;
        }

        console.log('Received platform message:', message);
        setLastMessage(message);
        setIsConnected(true);
        
        // Handle specific message types
        if (message.type === 'INVITATION_LOADED') {
          console.log('=== INVITATION_LOADED RECEIVED ===');
          console.log('Full message payload:', message.payload);
          
          if (message.payload?.rsvpFields) {
            console.log('RSVP Fields from postMessage:', message.payload.rsvpFields);
            console.log('Status:', message.payload.status);
            console.log('Show Submit Button:', message.payload.showSubmitButton);
            console.log('Show Edit Button:', message.payload.showEditButton);
          }
          
          console.log('=== END INVITATION_LOADED ===');
        } else if (message.type === 'INVITATION_PAYLOAD_UPDATE') {
          console.log('Invitation payload update:', message.data);
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
      timestamp: Date.now()
    };
    sendMessageToPlatform(readyMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sendMessageToPlatform]);

  // Send invitation viewed
  const sendInvitationViewed = useCallback((eventId: string, guestId: string) => {
    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: {
        eventId,
        guestId
      },
      timestamp: Date.now()
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform]);

  // Send RSVP acceptance
  const sendRSVPAccepted = useCallback((eventId: string, guestId: string) => {
    const message: TemplateMessage = {
      type: 'RSVP_ACCEPTED',
      data: {
        eventId,
        guestId
      },
      timestamp: Date.now()
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform]);

  // Send RSVP submission
  const sendRSVPSubmitted = useCallback((eventId: string, guestId: string, rsvpData: Record<string, any>) => {
    const message: TemplateMessage = {
      type: 'RSVP_SUBMITTED',
      data: {
        eventId,
        guestId,
        rsvpData
      },
      timestamp: Date.now()
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform]);

  // Send RSVP update
  const sendRSVPUpdated = useCallback((eventId: string, guestId: string, rsvpData: Record<string, any>) => {
    const message: TemplateMessage = {
      type: 'RSVP_UPDATED',
      data: {
        eventId,
        guestId,
        rsvpData
      },
      timestamp: Date.now()
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform]);

  return {
    lastMessage,
    isConnected,
    sendInvitationViewed,
    sendRSVPAccepted,
    sendRSVPSubmitted,
    sendRSVPUpdated,
    sendMessageToPlatform
  };
};