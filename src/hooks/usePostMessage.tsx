import { useEffect, useState, useCallback } from 'react';
import { PlatformMessage, TemplateMessage } from '../types/messages';

// Dynamic origin validation patterns
const isValidOrigin = (origin: string) => {
  const allowedPatterns = [
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.netlify\.app$/,
    /^https:\/\/.*\.platform\.com$/,
    /^https:\/\/utsavy2\.vercel\.app$/,
    /^https:\/\/localhost:\d+$/,
    /^http:\/\/localhost:\d+$/,
    /^https:\/\/127\.0\.0\.1:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/
  ];
  
  return allowedPatterns.some(pattern => pattern.test(origin)) || 
         origin === window.location.origin;
};

export const usePostMessage = (platformData?: any) => {
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
      // Validate origin for security using dynamic patterns
      if (!isValidOrigin(event.origin)) {
        console.warn('[TEMPLATE] Message from unauthorized origin:', event.origin);
        console.warn('[TEMPLATE] Allowed patterns: vercel.app, netlify.app, platform.com, localhost');
        return;
      }
      
      console.log('[TEMPLATE] Message from valid origin:', event.origin);

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
        } else if (message.type === 'LOAD_INVITATION_DATA') {
          console.log('=== LOAD_INVITATION_DATA RECEIVED ===');
          console.log('Full message data:', message.data);
          
          if (message.data?.event?.rsvp_config) {
            console.log('RSVP Config from postMessage:', message.data.event.rsvp_config);
            console.log('RSVP Type:', message.data.event.rsvp_config.type);
          }
          
          console.log('=== END LOAD_INVITATION_DATA ===');
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

  // Send RSVP acceptance with retry logic
  const sendRSVPAccepted = useCallback((rsvpData: Record<string, any> = {}) => {
    console.log('[TEMPLATE] Preparing RSVP acceptance message...');
    console.log('[TEMPLATE] Platform data:', platformData);
    console.log('[TEMPLATE] RSVP form data:', rsvpData);
    console.log('[TEMPLATE] Window parent exists:', window.parent !== window);
    
    const messageData: any = {
      accepted: true,
      // Include critical platform identifiers
      ...(platformData?.eventId && { eventId: platformData.eventId }),
      ...(platformData?.guestId && { guestId: platformData.guestId }),
      ...(platformData?.guestName && { guestName: platformData.guestName })
    };
    
    // Only include rsvpData if there are actual values
    if (Object.keys(rsvpData).length > 0) {
      messageData.rsvpData = rsvpData;
      console.log('[TEMPLATE] Including RSVP form data in message');
    } else {
      console.log('[TEMPLATE] Simple acceptance (no form data)');
    }
    
    const message: TemplateMessage = {
      type: 'RSVP_ACCEPTED',
      data: messageData,
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    
    console.log('[TEMPLATE] Sending RSVP acceptance message:', message);
    sendMessageToPlatform(message);
    console.log('[TEMPLATE] RSVP acceptance message sent successfully');
  }, [sendMessageToPlatform, platformData]);

  // Send RSVP decline
  const sendRSVPDeclined = useCallback(() => {
    console.log('[TEMPLATE] Preparing RSVP decline message...');
    console.log('[TEMPLATE] Platform data:', platformData);
    
    const messageData: any = {
      accepted: false,
      // Include critical platform identifiers
      ...(platformData?.eventId && { eventId: platformData.eventId }),
      ...(platformData?.guestId && { guestId: platformData.guestId }),
      ...(platformData?.guestName && { guestName: platformData.guestName })
    };
    
    const message: TemplateMessage = {
      type: 'RSVP_DECLINED',
      data: messageData,
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    
    console.log('[TEMPLATE] Sending RSVP decline message:', message);
    sendMessageToPlatform(message);
    console.log('[TEMPLATE] RSVP decline message sent successfully');
  }, [sendMessageToPlatform, platformData]);

  // Send invitation viewed analytics
  const sendInvitationViewed = useCallback((viewDuration: number) => {
    console.log('[TEMPLATE] Preparing invitation viewed message...');
    console.log('[TEMPLATE] View duration:', viewDuration);
    console.log('[TEMPLATE] Platform data:', platformData);
    
    const messageData: any = {
      timestamp: Date.now(),
      viewDuration,
      // Include platform identifiers if available
      ...(platformData?.eventId && { eventId: platformData.eventId }),
      ...(platformData?.guestId && { guestId: platformData.guestId })
    };
    
    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: messageData,
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    
    console.log('[TEMPLATE] Sending invitation viewed message:', message);
    sendMessageToPlatform(message);
    console.log('[TEMPLATE] Invitation viewed message sent successfully');
  }, [sendMessageToPlatform, platformData]);

  return {
    lastMessage,
    isConnected,
    sendRSVPAccepted,
    sendRSVPDeclined,
    sendInvitationViewed,
    sendMessageToPlatform
  };
};