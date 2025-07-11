
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Wish {
  id: string;
  guest_id: string;
  guest_name: string;
  content: string;
  image_url?: string;
  likes_count: number;
  replies_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  hasLiked?: boolean; // Added for platform integration
}

export interface WishLike {
  id: string;
  wish_id: string;
  guest_id: string;
  guest_name: string;
  created_at: string;
}

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

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const useWishes = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        case 'INITIAL_WISHES_DATA':
          console.log('Received initial wishes data:', payload);
          if (payload.wishes && Array.isArray(payload.wishes)) {
            setWishes(payload.wishes);
          }
          setIsLoading(false);
          break;
        case 'WISH_SUBMITTED_SUCCESS':
          console.log('Wish submitted successfully');
          toast({
            title: "✨ Wish Submitted!",
            description: "Your heartfelt wish has been submitted and is awaiting approval.",
            duration: 4000,
          });
          // Refresh wishes data
          window.parent.postMessage({
            type: 'REQUEST_WISHES_REFRESH',
            payload: {}
          }, '*');
          break;
        case 'WISH_SUBMITTED_ERROR':
          console.error('Error submitting wish:', payload.error);
          toast({
            title: "Error",
            description: "Failed to submit wish. Please try again.",
            variant: "destructive",
          });
          break;
        case 'WISH_LIKE_UPDATED':
          console.log('Wish like updated:', payload);
          // Update local state with new like data
          setWishes(prevWishes => 
            prevWishes.map(wish => 
              wish.id === payload.wishId 
                ? { 
                    ...wish, 
                    likes_count: payload.likes_count,
                    hasLiked: payload.hasLiked 
                  }
                : wish
            )
          );
          if (payload.hasLiked) {
            toast({
              title: "❤️ Liked!",
              description: "You liked this wish",
              duration: 2000,
            });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request initial wishes data from platform
    window.parent.postMessage({
      type: 'REQUEST_INITIAL_WISHES_DATA',
      payload: {}
    }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [toast]);

  // Submit a new wish with optional image
  const submitWish = async (content: string, guestId: string, guestName: string, imageFile?: File) => {
    if (!content.trim() || content.length > 280) {
      toast({
        title: "Invalid wish",
        description: "Please enter a wish between 1 and 280 characters.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!guestId || !guestName) {
      toast({
        title: "Error",
        description: "Guest information is missing. Please refresh the page.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Submitting wish:', { content, guestId, guestName, hasImage: !!imageFile });
      
      let imageData = null;
      if (imageFile) {
        console.log('Converting image to base64:', imageFile.name, 'Size:', imageFile.size);
        try {
          imageData = await fileToBase64(imageFile);
          console.log('Image converted to base64 successfully');
        } catch (error) {
          console.error('Error converting image to base64:', error);
          toast({
            title: "Image processing failed",
            description: "Could not process image, but wish will be submitted without it.",
            variant: "destructive",
          });
        }
      }

      const wishData = {
        guest_id: guestId,
        guest_name: guestName,
        content: content.trim(),
        image_data: imageData, // Send as base64 string
        image_filename: imageFile?.name || null,
        image_type: imageFile?.type || null
      };

      console.log('Sending wish data to platform:', wishData);

      // Send message to parent platform
      window.parent.postMessage({
        type: 'SUBMIT_NEW_WISH',
        payload: wishData
      }, '*');

      return true;
    } catch (error) {
      console.error('Error submitting wish:', error);
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
        description: "Please refresh the page to like wishes.",
        variant: "destructive",
      });
      return;
    }

    // Find current wish to determine current like status
    const currentWish = wishes.find(wish => wish.id === wishId);

    try {
      console.log('Toggling like for wish:', wishId, 'by guest:', guestId);
      
      const currentlyLiked = currentWish?.hasLiked || false;
      
      // Optimistic update - immediately update local state
      setWishes(wishes.map(wish => 
        wish.id === wishId 
          ? { 
              ...wish, 
              likes_count: currentlyLiked ? Math.max(0, wish.likes_count - 1) : wish.likes_count + 1,
              hasLiked: !currentlyLiked
            }
          : wish
      ));

      // Send message to parent platform
      window.parent.postMessage({
        type: 'TOGGLE_WISH_LIKE',
        payload: {
          wishId: wishId,
          guestId: guestId,
          guestName: guestName
        }
      }, '*');

    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setWishes(wishes.map(wish => 
        wish.id === wishId 
          ? { 
              ...wish, 
              likes_count: currentWish?.likes_count || 0,
              hasLiked: currentWish?.hasLiked || false
            }
          : wish
      ));
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const refreshWishes = () => {
    // Request fresh wishes data from platform
    window.parent.postMessage({
      type: 'REQUEST_WISHES_REFRESH',
      payload: {}
    }, '*');
  };

  return {
    wishes,
    isLoading,
    isSubmitting,
    submitWish,
    toggleLike,
    refreshWishes
  };
};
