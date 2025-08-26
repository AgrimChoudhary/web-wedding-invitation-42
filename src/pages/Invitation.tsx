import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGuest } from '@/context/GuestContext';
import { useWedding } from '@/context/WeddingContext';
import { usePlatform } from '@/context/PlatformContext';
import { TemplateRenderer } from '@/components/TemplateRenderer';

// Security: Define trusted origins
const TRUSTED_ORIGINS = [
  'https://utsavy-invitations.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080'
];

const isTrustedOrigin = (origin: string): boolean => {
  return TRUSTED_ORIGINS.includes(origin) || origin === window.location.origin;
};

const Invitation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { guestName, updateGuestStatus, guestId, setGuestName, setGuestId } = useGuest();
  const { weddingData, setAllWeddingData } = useWedding();
  const { isPlatformMode, trackInvitationViewed, rsvpConfig, wishesEnabled, showEditButton, platformData } = usePlatform();
  const location = useLocation();

  // URL parameter processing and context setup
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Guest Data
    const guestNameParam = params.get('guestName');
    const guestIdParam = params.get('guestId');
    
    if (guestNameParam) setGuestName(guestNameParam);
    if (guestIdParam) setGuestId(guestIdParam);

    // Wedding Data handling
    const weddingDataParam = params.get('weddingData');
    if (weddingDataParam) {
      try {
        const parsedWeddingData = JSON.parse(decodeURIComponent(weddingDataParam));
        if (parsedWeddingData.mainWedding?.date) {
          parsedWeddingData.mainWedding.date = new Date(parsedWeddingData.mainWedding.date);
        }
        setAllWeddingData(parsedWeddingData);
      } catch (e) {
        console.error('Error parsing wedding data:', e);
      }
    }

    // Track invitation viewed
    setTimeout(() => trackInvitationViewed(), 1000);
  }, [location.search, setGuestName, setGuestId, setAllWeddingData, trackInvitationViewed]);

  // Message listener for platform communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedOrigin(event.origin)) return;

      const { type, payload } = event.data;
      
      switch (type) {
        case 'UPDATE_WEDDING_DATA':
          if (payload.mainWedding?.date) {
            payload.mainWedding.date = new Date(payload.mainWedding.date);
          }
          setAllWeddingData(payload);
          break;
        case 'UPDATE_GUEST_DATA':
          if (payload.guestName) setGuestName(payload.guestName);
          if (payload.guestId) setGuestId(payload.guestId);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAllWeddingData, setGuestName, setGuestId]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptInvitation = () => {
    try {
      updateGuestStatus('accepted');
    } catch (error) {
      console.error('Error updating guest status:', error);
    }
  };

  // Get template ID from URL or use default
  const params = new URLSearchParams(location.search);
  const templateId = params.get('templateId') || 'royal';

  return (
    <TemplateRenderer
      templateId={templateId}
      weddingData={weddingData}
      guestName={guestName}
      guestId={guestId}
      platformData={platformData}
      isPlatformMode={isPlatformMode}
      rsvpConfig={rsvpConfig}
      showEditButton={showEditButton}
      wishesEnabled={wishesEnabled}
      onAcceptInvitation={handleAcceptInvitation}
      onOpenRSVP={() => {}}
      onOpenWishes={() => {}}
      isLoading={isLoading}
    />
  );
};

export default Invitation;