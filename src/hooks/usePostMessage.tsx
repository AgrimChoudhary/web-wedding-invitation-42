import { useEffect, useState, useCallback } from 'react';
import { PlatformMessage, TemplateMessage } from '../types/messages';

// Dynamic origin validation for better platform compatibility
const isValidOrigin = (origin: string): boolean => {
  const allowedPatterns = [
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.netlify\.app$/,
    /^https:\/\/.*\.herokuapp\.com$/,
    /^https:\/\/localhost:\d+$/,
    /^http:\/\/localhost:\d+$/,
    /^https:\/\/127\.0\.0\.1:\d+$/,
    /^http:\/\/127\.0\.0\.1:\d+$/
  ];
  
  // Always allow same origin
  if (origin === window.location.origin) return true;
  
  // Check against allowed patterns
  return allowedPatterns.some(pattern => pattern.test(origin));
};

export const usePostMessage = () => {
  const [lastMessage, setLastMessage] = useState<PlatformMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [platformData, setPlatformData] = useState<any>(null);

  // Send message to platform with retry logic
  const sendMessageToPlatform = useCallback((message: TemplateMessage, maxRetries: number = 3) => {
    let attempts = 0;
    
    const attemptSend = () => {
      try {
        console.log(`[TEMPLATE] Sending message (attempt ${attempts + 1}/${maxRetries}):`, message);
        console.log('[TEMPLATE] Current platform data:', platformData);
        console.log('[TEMPLATE] Window parent exists:', window.parent !== window);
        console.log('[TEMPLATE] Message type:', message.type);
        
        // Send to parent window (platform iframe container)
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(message, '*');
          console.log('[TEMPLATE] ✅ Message sent successfully:', message);
        } else {
          console.warn('[TEMPLATE] ⚠️ No parent window found, running standalone');
        }
      } catch (error) {
        console.error(`[TEMPLATE] ❌ Error sending message (attempt ${attempts + 1}):`, error);
        
        attempts++;
        if (attempts < maxRetries) {
          console.log(`[TEMPLATE] 🔄 Retrying in 500ms...`);
          setTimeout(attemptSend, 500);
        } else {
          console.error('[TEMPLATE] ❌ Max retry attempts reached, giving up');
        }
      }
    };
    
    attemptSend();
  }, [platformData]);

  // Listen for messages from platform
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security using dynamic validation
      if (!isValidOrigin(event.origin)) {
        console.warn('[TEMPLATE] ⚠️ Message from unauthorized origin:', event.origin);
        return;
      }

      try {
        const message = event.data as PlatformMessage;
        
        // Validate message structure
        if (!message.type || !message.timestamp || message.source !== 'PLATFORM') {
          console.warn('Invalid message structure:', message);
          return;
        }

        console.log('[TEMPLATE] 📨 Received platform message:', message);
        setLastMessage(message);
        setIsConnected(true);
        
        // Extract and update platform data from messages
        if (message.type === 'LOAD_INVITATION_DATA' && message.data) {
          const newPlatformData = {
            eventId: message.data.event?.id || (message.data as any).eventId,
            guestId: message.data.guest?.id || (message.data as any).guestId,
            guestName: message.data.guest?.name || (message.data as any).guestName
          };
          setPlatformData(newPlatformData);
          console.log('[TEMPLATE] 💾 Updated platform data for messaging:', newPlatformData);
        } else if (message.type === 'INVITATION_LOADED' && message.data) {
          // Extract comprehensive RSVP data from INVITATION_LOADED message
          console.log('[TEMPLATE] 🎯 === PROCESSING INVITATION_LOADED IN POSTMESSAGE ===');
          console.log('[TEMPLATE] 📊 Full INVITATION_LOADED data:', message.data);
          
          const rsvpData = {
            eventId: message.data.eventId,
            guestId: message.data.guestId,
            guestName: message.data.guestName,
            eventName: message.data.eventName,
            
            // Legacy compatibility
            hasResponded: message.data.hasResponded,
            accepted: message.data.accepted,
            guestViewed: message.data.guestViewed,
            guestAccepted: message.data.guestAccepted,
            
            // Enhanced RSVP status
            guestStatus: message.data.guestStatus,
            viewed: message.data.viewed,
            custom_fields_submitted: message.data.custom_fields_submitted,
            
            // RSVP configuration
            rsvpConfig: message.data.rsvpConfig,
            hasCustomFields: message.data.hasCustomFields,
            allowEditAfterSubmit: message.data.allowEditAfterSubmit,
            
            // CRITICAL: UI control flags from platform
            canSubmitRsvp: message.data.canSubmitRsvp,
            canEditRsvp: message.data.canEditRsvp,
            showSubmitButton: message.data.showSubmitButton,
            showEditButton: message.data.showEditButton,
            
            // RSVP data
            rsvpData: message.data.rsvpData,
            existingRsvpData: message.data.existingRsvpData,
            
            // Custom fields
            customFields: message.data.customFields,
            
            // Timestamps
            viewed_at: message.data.viewed_at,
            accepted_at: message.data.accepted_at,
            custom_fields_submitted_at: message.data.custom_fields_submitted_at
          };
          
          console.log('[TEMPLATE] 🔄 Updating platform data with INVITATION_LOADED:', {
            currentData: platformData,
            newData: rsvpData,
            criticalFlags: {
              guestStatus: rsvpData.guestStatus,
              canSubmitRsvp: rsvpData.canSubmitRsvp,
              canEditRsvp: rsvpData.canEditRsvp,
              showSubmitButton: rsvpData.showSubmitButton,
              showEditButton: rsvpData.showEditButton
            }
          });
          
          setPlatformData(rsvpData);
          console.log('[TEMPLATE] ✅ Platform data updated from INVITATION_LOADED');
          console.log('[TEMPLATE] === END PROCESSING INVITATION_LOADED IN POSTMESSAGE ===');
        }
        
        // Handle specific message types
        if (message.type === 'WEDDING_DATA_TRANSFER') {
          console.log('[TEMPLATE] 💒 Wedding data received:', message.data);
        } else if (message.type === 'LOAD_INVITATION_DATA') {
          console.log('[TEMPLATE] === LOAD_INVITATION_DATA RECEIVED ===');
          console.log('[TEMPLATE] Full message data:', message.data);
          
          if (message.data?.event?.rsvp_config) {
            console.log('[TEMPLATE] RSVP Config from postMessage:', message.data.event.rsvp_config);
            console.log('[TEMPLATE] RSVP Type:', message.data.event.rsvp_config.type);
          }
          
          console.log('[TEMPLATE] === END LOAD_INVITATION_DATA ===');
        } else if (message.type === 'INVITATION_LOADED') {
          console.log('[TEMPLATE] 👁️ Invitation loaded:', message.data);
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

  // Send RSVP acceptance with enhanced data
  const sendRSVPAccepted = useCallback((rsvpData: Record<string, any> = {}) => {
    console.log('[TEMPLATE] 🎯 Preparing RSVP message...');
    console.log('[TEMPLATE] RSVP Data:', rsvpData);
    console.log('[TEMPLATE] Platform Data Available:', platformData);
    
    const messageData: any = { 
      accepted: true,
      ...(platformData?.eventId && { eventId: platformData.eventId }),
      ...(platformData?.guestId && { guestId: platformData.guestId }),
      ...(platformData?.guestName && { guestName: platformData.guestName })
    };
    
    // Only include rsvpData if there are actual values
    if (Object.keys(rsvpData).length > 0) {
      messageData.rsvpData = rsvpData;
      console.log('[TEMPLATE] 📝 Including RSVP form data');
    }
    
    const message: TemplateMessage = {
      type: 'RSVP_ACCEPTED',
      data: messageData,
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    
    console.log('[TEMPLATE] 🚀 Final RSVP message:', message);
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform, platformData]);

  // Send invitation viewed analytics with enhanced data
  const sendInvitationViewed = useCallback((viewDuration: number) => {
    console.log('[TEMPLATE] 👁️ Sending invitation viewed analytics...');
    
    const messageData: any = {
      timestamp: Date.now(),
      viewDuration,
      ...(platformData?.eventId && { eventId: platformData.eventId }),
      ...(platformData?.guestId && { guestId: platformData.guestId }),
      ...(platformData?.guestName && { guestName: platformData.guestName })
    };
    
    const message: TemplateMessage = {
      type: 'INVITATION_VIEWED',
      data: messageData,
      timestamp: Date.now(),
      source: 'TEMPLATE'
    };
    
    console.log('[TEMPLATE] 📊 Analytics message:', message);
    sendMessageToPlatform(message);
  }, [sendMessageToPlatform, platformData]);

  return {
    lastMessage,
    isConnected,
    sendRSVPAccepted,
    sendInvitationViewed,
    sendMessageToPlatform
  };
};