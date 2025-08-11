
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Wish {
  id: string;
  guest_id: string;
  guest_name: string;
  content: string;
  image_url?: string;
  likes_count: number;
  replies_count?: number; // Optional - not in database
  is_approved: boolean;
  created_at: string;
  updated_at?: string; // Optional - fallback to created_at
  hasLiked?: boolean; // Optional - not in database
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
    console.log('🚀 TEMPLATE: Setting up wish message listener...');
    
    const handleMessage = (event: MessageEvent) => {
      console.log('📥 TEMPLATE: Received message from platform:', event.data);
      console.log('📍 TEMPLATE: Message origin:', event.origin);
      
      // Security check
      if (!isTrustedOrigin(event.origin)) {
        console.warn('⚠️ TEMPLATE: Untrusted origin se message mila:', event.origin);
        return;
      }

      const { type, data, payload } = event.data;
      console.log('🔍 TEMPLATE: Processing message type:', type);
      console.log('📦 TEMPLATE: Full event data:', event.data);
      console.log('📦 TEMPLATE: Message data:', data);
      console.log('📦 TEMPLATE: Message payload:', payload);
      
      // Use data if available, otherwise use payload
      const messageData = data || payload;

      switch (type) {
        case 'INVITATION_LOADED':
          console.log('✅ TEMPLATE: Received INVITATION_LOADED with wishes data!');
          console.log('📊 TEMPLATE: Full invitation data:', messageData);
          
          // Check if wishes data is included in invitation data
          if (messageData && messageData.wishes && Array.isArray(messageData.wishes)) {
            console.log('🎁 TEMPLATE: Found wishes in invitation data:', messageData.wishes.length, 'wishes');
            
            // Transform wishes to match expected format
            const transformedWishes = messageData.wishes.map(wish => ({
              id: wish.id,
              guest_id: wish.guest_id,
              guest_name: wish.guest_name,
              content: wish.content,
              image_url: wish.image_url,
              likes_count: wish.likes_count || 0,
              is_approved: wish.is_approved,
              created_at: wish.created_at
            }));
            
            console.log('🔄 TEMPLATE: Transformed wishes from invitation data:', transformedWishes);
            setWishes(transformedWishes);
            setIsLoading(false);
          } else {
            console.log('📝 TEMPLATE: No wishes data in invitation, will request separately');
            console.log('📝 TEMPLATE: MessageData structure:', messageData);
            // If no wishes in invitation data, request them separately
            window.parent.postMessage({
              type: 'REQUEST_INITIAL_WISHES_DATA',
              payload: {}
            }, '*');
          }
          break;
        case 'INITIAL_WISHES_DATA':
              console.log('✅ TEMPLATE: Received initial wishes data from platform!');
              console.log('📊 TEMPLATE: Payload structure:', payload);
              console.log('📊 TEMPLATE: Is wishes array?', Array.isArray(payload?.wishes));
              console.log('📊 TEMPLATE: Wishes count:', payload?.wishes?.length || 0);
              console.log('📊 TEMPLATE: Raw wishes data:', payload?.wishes);
              
              if (payload && payload.wishes && Array.isArray(payload.wishes)) {
                console.log('✅ TEMPLATE: Setting wishes in state:', payload.wishes.length, 'wishes');
                
                // Detailed analysis of each wish
                console.log('\n🔍 TEMPLATE: DETAILED WISH DATA ANALYSIS:');
                console.log('================================================');
                
                payload.wishes.forEach((wish, index) => {
                  console.log(`\n📝 TEMPLATE: === WISH ${index + 1} ANALYSIS ===`);
                  console.log('🎯 TEMPLATE: Complete wish object:', wish);
                  
                  // Check required fields
                  const requiredFields = ['id', 'guest_id', 'guest_name', 'content', 'likes_count', 'is_approved', 'created_at'];
                  const optionalFields = ['image_url', 'replies_count', 'updated_at', 'hasLiked'];
                  
                  console.log('✅ TEMPLATE: Required fields check:');
                  let missingFields = [];
                  requiredFields.forEach(field => {
                    const exists = wish.hasOwnProperty(field);
                    const value = wish[field];
                    console.log(`   ${exists ? '✅' : '❌'} ${field}:`, exists ? value : 'MISSING!');
                    if (!exists) missingFields.push(field);
                  });
                  
                  if (missingFields.length > 0) {
                    console.error('❌ TEMPLATE: CRITICAL - Wish missing required fields:', missingFields);
                    console.error('❌ TEMPLATE: This wish may not display correctly');
                  }
                  
                  console.log('🔧 TEMPLATE: Optional fields check:');
                  optionalFields.forEach(field => {
                    const exists = wish.hasOwnProperty(field);
                    const value = wish[field];
                    console.log(`   ${exists ? '✅' : '⚪'} ${field}:`, exists ? value : 'Not provided (OK)');
                  });
                  
                  // Data type validation
                  console.log('🔍 TEMPLATE: Data types:');
                  console.log(`   id: ${typeof wish.id} (should be string)`);
                  console.log(`   guest_name: ${typeof wish.guest_name} (should be string)`);
                  console.log(`   content: ${typeof wish.content} (should be string)`);
                  console.log(`   likes_count: ${typeof wish.likes_count} (should be number)`);
                  console.log(`   is_approved: ${typeof wish.is_approved} (should be boolean)`);
                  
                  // Validate critical data
                  if (!wish.is_approved) {
                    console.warn('⚠️ TEMPLATE: Wish is not approved - will be filtered out:', wish.guest_name);
                  }
                  if (!wish.content || wish.content.trim() === '') {
                    console.error('❌ TEMPLATE: Wish has empty content:', wish.guest_name);
                  }
                  
                  // Check for any extra fields
                  const allExpectedFields = [...requiredFields, ...optionalFields];
                  const wishKeys = Object.keys(wish);
                  const extraFields = wishKeys.filter(key => !allExpectedFields.includes(key));
                  if (extraFields.length > 0) {
                    console.log('🆕 TEMPLATE: Extra fields found:', extraFields);
                    extraFields.forEach(field => {
                      console.log(`   🆕 ${field}:`, wish[field]);
                    });
                  }
                });
                
                console.log('\n📊 TEMPLATE: SUMMARY STATISTICS:');
                console.log('================================================');
                console.log(`Total wishes received: ${payload.wishes.length}`);
                
                const approvedWishes = payload.wishes.filter(w => w.is_approved);
                const unapprovedWishes = payload.wishes.filter(w => !w.is_approved);
                console.log(`Approved wishes: ${approvedWishes.length}`);
                console.log(`Unapproved wishes: ${unapprovedWishes.length}`);
                
                if (approvedWishes.length === 0 && unapprovedWishes.length > 0) {
                  console.warn('⚠️ TEMPLATE: ISSUE FOUND - Wishes received but none are approved!');
                  console.warn('⚠️ TEMPLATE: Host needs to approve wishes in management panel');
                  console.warn('⚠️ TEMPLATE: Unapproved wishes will not display in carousel');
                } else if (approvedWishes.length === 0) {
                  console.warn('⚠️ TEMPLATE: No wishes to display - either no wishes exist or none approved');
                }
                
                console.log(`Wishes with images: ${payload.wishes.filter(w => w.image_url).length}`);
                console.log(`Wishes with likes: ${payload.wishes.filter(w => w.likes_count > 0).length}`);
                console.log('================================================\n');
                
                // Validate wishes before setting state
                const validWishes = payload.wishes.filter(wish => {
                  const isValid = wish.id && wish.guest_name && wish.content && typeof wish.is_approved === 'boolean';
                  if (!isValid) {
                    console.warn('⚠️ TEMPLATE: Filtering out invalid wish:', wish);
                  }
                  return isValid;
                });
                
                console.log('✅ TEMPLATE: Setting valid wishes in state:', validWishes.length);
                setWishes(validWishes);
                
                // Trigger carousel check after state update
                setTimeout(() => {
                  const approvedForCarousel = validWishes.filter(w => w.is_approved);
                  console.log('🎠 TEMPLATE: Wishes available for carousel display:', approvedForCarousel.length);
                  if (approvedForCarousel.length === 0) {
                    console.warn('⚠️ TEMPLATE: No approved wishes for carousel - carousel will show empty state');
                  }
                }, 100);
                
              } else {
                console.warn('⚠️ TEMPLATE: Invalid wishes data received:', payload);
                console.warn('⚠️ TEMPLATE: Expected format: { wishes: [...] }');
                console.error('❌ TEMPLATE: This means platform sent malformed data or communication failed');
                
                // Set empty array to clear loading state
                setWishes([]);
              }
          
          console.log('⏰ TEMPLATE: Setting isLoading to false');
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
        case 'WISH_APPROVED':
          console.log('Wish approved:', payload);
          toast({
            title: "✨ Wish Approved!",
            description: "Your wish has been approved and is now visible to all guests",
            duration: 4000,
          });
          // Refresh wishes data to get updated list
          window.parent.postMessage({
            type: 'REQUEST_WISHES_REFRESH',
            payload: {}
          }, '*');
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

    console.log('👂 TEMPLATE: Adding message event listener');
    window.addEventListener('message', handleMessage);
    
    // Request initial wishes data from platform
    console.log('📤 TEMPLATE: Requesting initial wishes data from platform...');
    console.log('📤 TEMPLATE: Sending message to parent window');
    
    const wishRequest = {
      type: 'REQUEST_INITIAL_WISHES_DATA',
      payload: {}
    };
    console.log('📤 TEMPLATE: Request message:', wishRequest);
    
        window.parent.postMessage(wishRequest, '*');
    
    // Set up heartbeat to show template is still waiting for response
    const heartbeat = setInterval(() => {
      if (isLoading) {
        console.log('💓 TEMPLATE: Still waiting for platform response...', new Date().toISOString());
        console.log('💓 TEMPLATE: Loading state:', isLoading, '| Wishes count:', wishes.length);
      }
    }, 3000); // Log every 3 seconds
    
        // Set a timeout to check if we get response
        const responseTimeout = setTimeout(() => {
          if (isLoading) {
            console.error('⚠️ TEMPLATE: No response from platform after 15 seconds!');
            console.error('⚠️ TEMPLATE: Platform may not be handling REQUEST_INITIAL_WISHES_DATA');
            console.error('⚠️ TEMPLATE: Check if wish handlers are registered in platform');
            console.error('⚠️ TEMPLATE: This means either:');
            console.error('   - Platform is not receiving the message');
            console.error('   - Database query is hanging/timing out'); 
            console.error('   - Platform is not sending response back');
            console.error('   - Message handler is not registered properly');
            console.error('🔍 TEMPLATE: Current loading state:', isLoading);
            console.error('🔍 TEMPLATE: Current wishes count:', wishes.length);
          }
        }, 15000); // Increased to 15 seconds to allow for database timeout

    return () => {
      console.log('🧹 TEMPLATE: Cleaning up wish message listener');
      window.removeEventListener('message', handleMessage);
      clearTimeout(responseTimeout);
      clearInterval(heartbeat);
    };
  }, [toast, isLoading]);

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
