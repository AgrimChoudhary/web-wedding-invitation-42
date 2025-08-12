import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Wish {
  id: string;
  guest_id: string;
  guest_name: string;
  content: string;
  image_url?: string;
  likes_count: number;
  is_approved: boolean;
  created_at: string;
  hasLiked?: boolean;
}

// Simple file to base64 conversion
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Simple origin check
const isTrustedOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://utsavy1-05.vercel.app',
    'https://utsavy2.vercel.app',
    window.location.origin
  ];
  return allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1');
};

export const useWishes = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set up message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check
      if (!isTrustedOrigin(event.origin)) {
        return;
      }

      const { type, data, payload } = event.data || {};
      const messageData = data || payload;

      switch (type) {
        case 'INVITATION_LOADED':
          if (messageData?.wishes && Array.isArray(messageData.wishes)) {
            setWishes(messageData.wishes);
            setIsLoading(false);
          } else {
            // Request wishes separately
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({
                type: 'REQUEST_INITIAL_WISHES_DATA'
              }, '*');
            }
          }
          break;

        case 'INITIAL_WISHES_DATA':
        case 'INITIAL_ADMIN_WISHES_DATA':
          if (messageData?.wishes && Array.isArray(messageData.wishes)) {
            setWishes(messageData.wishes);
          } else {
            setWishes([]);
          }
          setIsLoading(false);
          break;

        case 'WISH_SUBMITTED_SUCCESS':
          toast({
            title: "Wish submitted!",
            description: "Your wish has been submitted and will appear after approval.",
          });
          setIsSubmitting(false);
          break;

        case 'WISH_SUBMITTED_ERROR':
          const errorMsg = messageData?.error || "Failed to submit wish. Please try again.";
          let userFriendlyMsg = errorMsg;
          
          // Make error messages more user-friendly
          if (errorMsg.includes('Event not found')) {
            userFriendlyMsg = "Event not found. Please refresh the page or contact support.";
          } else if (errorMsg.includes('Guest not found')) {
            userFriendlyMsg = "Guest information not found. Please refresh the page.";
          } else if (errorMsg.includes('wishes are disabled')) {
            userFriendlyMsg = "Wishes feature is currently disabled for this event.";
          } else if (errorMsg.includes('Event ID is missing')) {
            userFriendlyMsg = "Event information is missing. Please refresh the page.";
          }
          
          toast({
            title: "Error",
            description: userFriendlyMsg,
            variant: "destructive",
          });
          setIsSubmitting(false);
          break;

        case 'WISH_APPROVED':
          toast({
            title: "Wish approved!",
            description: "The wish has been approved and is now visible.",
          });
          break;

        case 'WISH_DELETED':
          toast({
            title: "Wish deleted",
            description: "The wish has been deleted.",
          });
          break;

        case 'WISH_LIKE_UPDATED':
          if (messageData?.wishId) {
            setWishes(prevWishes => 
              prevWishes.map(wish => 
                wish.id === messageData.wishId 
                  ? { 
                      ...wish, 
                      likes_count: messageData.likes_count || wish.likes_count,
                      hasLiked: messageData.hasLiked 
                    }
                  : wish
              )
            );
          }
          break;

        case 'ERROR':
          toast({
            title: "Error",
            description: messageData?.error || "An error occurred.",
            variant: "destructive",
          });
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Request initial data
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'REQUEST_INITIAL_WISHES_DATA'
      }, '*');
    } else {
      setIsLoading(false);
    }

    // Timeout for loading
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setWishes([]);
    }, 5000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeout);
    };
  }, [toast]);

  // Submit a new wish
  const submitWish = async (content: string, guestId: string, guestName: string, imageFile?: File) => {
    // Validation
    if (!content.trim() || content.length > 280) {
      toast({
        title: "Invalid wish",
        description: "Please enter a wish between 1 and 280 characters.",
        variant: "destructive",
      });
      return false;
    }
    
    // Get guest info and event info from URL if not provided
    let finalGuestId = guestId;
    let finalGuestName = guestName;
    let eventId = '';
    
    const urlParams = new URLSearchParams(window.location.search);
    
    if (!finalGuestId || !finalGuestName) {
      finalGuestId = finalGuestId || urlParams.get('guestId');
      finalGuestName = finalGuestName || urlParams.get('guestName');
    }
    
    // Get event ID from URL
    eventId = urlParams.get('eventId') || '';
    
    // Debug info (can be removed in production)
    if (!eventId) {
      console.log('Missing eventId from URL:', window.location.href);
    }
    
    if (!finalGuestId || !finalGuestName) {
      toast({
        title: "Error",
        description: "Guest information is missing. Please refresh the page.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!eventId) {
      toast({
        title: "Error", 
        description: "Event information is missing. Please refresh the page.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Handle image conversion
      let imageData = null;
      if (imageFile) {
        try {
          imageData = await fileToBase64(imageFile);
        } catch (error) {
          // Silent fail for image
        }
      }

      // Create wish data with event ID
      const wishData = {
        event_id: eventId,  // Add event ID to payload
        guest_id: finalGuestId,
        guest_name: finalGuestName,
        content: content.trim(),
        image_data: imageData,
        image_filename: imageFile?.name || null,
        image_type: imageFile?.type || null
      };

      // Wish data ready for submission

      // Send to platform
      if (!window.parent || window.parent === window) {
        throw new Error('Not loaded in iframe');
      }
        
      window.parent.postMessage({
        type: 'SUBMIT_NEW_WISH',
        payload: wishData,
        timestamp: Date.now()
      }, '*');
        
      // Success message will come from platform response
      return true;
        
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit wish. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle like on a wish
  const toggleLike = async (wishId: string, guestId: string, guestName: string) => {
    if (!guestId || !guestName) {
      toast({
        title: "Error",
        description: "Guest information is missing.",
        variant: "destructive",
      });
      return;
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'TOGGLE_WISH_LIKE',
        payload: {
          wishId,
          guestId,
          guestName
        }
      }, '*');
    }
  };

  return {
    wishes,
    isLoading,
    isSubmitting,
    submitWish,
    toggleLike
  };
};
