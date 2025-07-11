import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface GuestContextType {
  guestName: string;
  setGuestName: (name: string) => void;
  guestId: string | null;
  setGuestId: (id: string | null) => void;
  isLoading: boolean;
  guestStatus: string | null;
  hasAccepted: boolean;
  updateGuestStatus: (status: 'viewed' | 'accepted' | 'declined') => Promise<void>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

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

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestName, setGuestName] = useState<string>('');
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestStatus, setGuestStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  
  useEffect(() => {
    const fetchGuestInfo = async () => {
      setIsLoading(true);
      
      // Extract guestId from path
      const pathParts = location.pathname.split('/').filter(Boolean);
      let currentGuestId: string | null = null;
      
      if (pathParts.length === 1 && pathParts[0] !== 'invitation' && pathParts[0] !== 'guest-management') {
        currentGuestId = pathParts[0];
      } else if (pathParts.length === 2 && pathParts[0] === 'invitation') {
        currentGuestId = pathParts[1];
      }
      
      // Read URL parameters for guest data
      const params = new URLSearchParams(location.search);
      const guestNameParam = params.get('guestName');
      const guestIdParam = params.get('guestId') || currentGuestId;
      const guestStatusParam = params.get('guestStatus');
      
      if (guestNameParam) {
        setGuestName(guestNameParam);
      }
      
      if (guestIdParam) {
        setGuestId(guestIdParam);
      }
      
      if (guestStatusParam) {
        setGuestStatus(guestStatusParam);
      }
      
      setIsLoading(false);
    };
    
    fetchGuestInfo();
  }, [location.pathname, location.search]);

  // Set up message listener for platform communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check
      if (!isTrustedOrigin(event.origin)) {
        console.warn('Untrusted origin se message mila:', event.origin);
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'GUEST_STATUS_UPDATE':
          if (payload.guestId === guestId) {
            setGuestStatus(payload.status);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [guestId]);

  const updateGuestStatus = async (status: 'viewed' | 'accepted' | 'declined') => {
    if (!guestId) return;
    
    try {
      // Send message to parent platform instead of direct Supabase call
      window.parent.postMessage({
        type: status === 'accepted' ? 'RSVP_ACCEPTED' : 
              status === 'declined' ? 'RSVP_DECLINED' : 'GUEST_STATUS_UPDATE',
        payload: {
          guestId: guestId,
          status: status,
          timestamp: new Date().toISOString()
        }
      }, '*');
      
      // Optimistic update
      setGuestStatus(status);
      
    } catch (error) {
      console.error(`Error updating guest status to ${status}:`, error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <GuestContext.Provider value={{ 
      guestName, 
      setGuestName, 
      guestId,
      setGuestId, 
      isLoading, 
      guestStatus,
      hasAccepted: guestStatus === 'accepted',
      updateGuestStatus 
    }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};