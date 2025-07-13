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
  const sendRSVPAccepted = useCallback((rsvpData: {
    attendees?: number;
    dietary_requirements?: string;
    special_requests?: string;
  } = {}) => {
    const messageData: any = { accepted: true };
    
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
  }, [sendMessageToPlatform]);

  // Send invitation viewed analytics
  const sendInvitationViewed = useCallback((viewDuration: number) => {
    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: {
        timestamp: Date.now(),
        viewDuration
      },
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform]);

  return {
    lastMessage,
    isConnected,
    sendRSVPAccepted,
    sendInvitationViewed,
    sendMessageToPlatform
  };
};