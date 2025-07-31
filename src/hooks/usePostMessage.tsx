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
  const [templateReadySent, setTemplateReadySent] = useState(false);

  // Validate message data before sending
  const validateMessageData = (eventId?: string, guestId?: string): boolean => {
    if (!eventId || !guestId) {
      console.error('❌ Message validation failed: Missing eventId or guestId', { eventId, guestId });
      return false;
    }
    return true;
  };

  // Send message to platform with validation and logging
  const sendMessageToPlatform = useCallback((message: TemplateMessage) => {
    try {
      // Send to parent window (platform iframe container)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
        console.log('✅ Sent message to platform:', {
          type: message.type,
          eventId: message.data && 'eventId' in message.data ? message.data.eventId : undefined,
          guestId: message.data && 'guestId' in message.data ? message.data.guestId : undefined,
          timestamp: message.timestamp
        });
      } else {
        console.warn('⚠️ No parent window found, running standalone');
      }
    } catch (error) {
      console.error('❌ Error sending message to platform:', error);
    }
  }, []);

  // Send TEMPLATE_READY message with eventId and guestId
  const sendTemplateReady = useCallback((eventId?: string, guestId?: string) => {
    if (templateReadySent) {
      console.log('⚠️ TEMPLATE_READY already sent, skipping');
      return;
    }

    const readyMessage: TemplateMessage = {
      type: 'TEMPLATE_READY',
      data: { 
        templateVersion: '1.0',
        ...(eventId && guestId && { eventId, guestId })
      },
      timestamp: Date.now()
    };
    
    sendMessageToPlatform(readyMessage);
    setTemplateReadySent(true);
    console.log('✅ TEMPLATE_READY sent with eventId/guestId:', { eventId, guestId });
  }, [sendMessageToPlatform, templateReadySent]);

  // Listen for messages from platform
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn('⚠️ Message from unauthorized origin:', event.origin);
        return;
      }

      try {
        const message = event.data as PlatformMessage;
        
        // Validate message structure
        if (!message.type || !message.timestamp) {
          console.warn('⚠️ Invalid message structure:', message);
          return;
        }

        console.log('📨 Received platform message:', {
          type: message.type,
          timestamp: message.timestamp,
          hasPayload: 'payload' in message ? !!message.payload : false
        });
        setLastMessage(message);
        setIsConnected(true);
        
        // Handle specific message types
        if (message.type === 'INVITATION_LOADED' && 'payload' in message) {
          console.log('=== 📨 INVITATION_LOADED RECEIVED ===');
          console.log('Event ID:', message.payload?.eventId);
          console.log('Guest ID:', message.payload?.guestId);
          console.log('Status:', message.payload?.status);
          console.log('RSVP Fields count:', message.payload?.rsvpFields?.length || 0);
          console.log('Show Submit Button:', message.payload?.showSubmitButton);
          console.log('Show Edit Button:', message.payload?.showEditButton);
          console.log('=== END INVITATION_LOADED ===');
        } else if (message.type === 'INVITATION_PAYLOAD_UPDATE' && 'data' in message) {
          console.log('📨 Invitation payload update:', message.data);
        }
        
      } catch (error) {
        console.error('❌ Error processing message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Send invitation viewed
  const sendInvitationViewed = useCallback((eventId: string, guestId: string) => {
    if (!validateMessageData(eventId, guestId)) return;

    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: {
        eventId,
        guestId
      },
      timestamp: Date.now()
    };
    sendMessageToPlatform(message);
    console.log('✅ INVITATION_VIEWED sent:', { eventId, guestId });
  }, [sendMessageToPlatform]);

  // Send RSVP acceptance
  const sendRSVPAccepted = useCallback((eventId: string, guestId: string) => {
    if (!validateMessageData(eventId, guestId)) return;

    console.log('🎉 Sending RSVP_ACCEPTED with data:', { eventId, guestId });
    
    const message: TemplateMessage = {
      type: 'RSVP_ACCEPTED',
      data: {
        eventId,
        guestId
      },
      timestamp: Date.now()
    };
    
    sendMessageToPlatform(message);
    console.log('✅ RSVP_ACCEPTED sent successfully');
  }, [sendMessageToPlatform]);

  // Send RSVP submission
  const sendRSVPSubmitted = useCallback((eventId: string, guestId: string, rsvpData: Record<string, any>) => {
    if (!validateMessageData(eventId, guestId)) return;

    console.log('📝 Sending RSVP_SUBMITTED with data:', { eventId, guestId, rsvpData });
    
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
    console.log('✅ RSVP_SUBMITTED sent successfully');
  }, [sendMessageToPlatform]);

  // Send RSVP update
  const sendRSVPUpdated = useCallback((eventId: string, guestId: string, rsvpData: Record<string, any>) => {
    if (!validateMessageData(eventId, guestId)) return;

    console.log('✏️ Sending RSVP_UPDATED with data:', { eventId, guestId, rsvpData });
    
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
    console.log('✅ RSVP_UPDATED sent successfully');
  }, [sendMessageToPlatform]);

  return {
    lastMessage,
    isConnected,
    sendInvitationViewed,
    sendRSVPAccepted,
    sendRSVPSubmitted,
    sendRSVPUpdated,
    sendMessageToPlatform,
    sendTemplateReady
  };
};