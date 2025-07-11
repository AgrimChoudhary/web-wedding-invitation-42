import React, { useState } from 'react';
import { X, Check, X as XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useGuest } from '@/context/GuestContext';

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ open, onOpenChange }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { guestName, guestStatus, updateGuestStatus, guestId } = useGuest();
  
  const handleClose = () => {
    onOpenChange(false);
    setMessage('');
  };
  
  const handleSubmit = async (status: 'accepted' | 'declined') => {
    setIsSubmitting(true);
    
    try {
      await updateGuestStatus(status);
      
      // Send additional RSVP data to platform
      window.parent.postMessage({
        type: 'RSVP_ADDITIONAL_DATA',
        payload: {
          guestId: guestId,
          status: status,
          message: message.trim() || null,
          timestamp: new Date().toISOString()
        }
      }, '*');
      
      toast({
        title: status === 'accepted' ? "RSVP Confirmed" : "RSVP Response Received",
        description: status === 'accepted' 
          ? "Thank you for accepting our invitation!" 
          : "Thank you for letting us know. We'll miss you!",
      });
      
      handleClose();
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      toast({
        title: "Error",
        description: "Failed to submit your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Don't show RSVP button if the guest has already responded
  if (guestStatus === 'accepted' || guestStatus === 'declined') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-wedding-cream/95 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-dancing-script text-wedding-maroon relative">
            <span className="before:content-[''] before:absolute before:h-1 before:w-12 before:bg-wedding-gold/50 before:-bottom-2 before:left-0">
              RSVP
            </span>
          </DialogTitle>
          <DialogDescription className="pt-4">
            <p className="font-playfair text-gray-600">
              We're excited to celebrate with you, {guestName || 'Guest'}!
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rsvp-message">Would you like to share a message? (optional)</Label>
            <Textarea
              id="rsvp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="border-wedding-gold/30 focus:border-wedding-gold/50 focus-visible:ring-wedding-gold/20"
            />
          </div>
        </div>
        
        <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            className="border-wedding-gold/30 hover:bg-wedding-gold/10 text-wedding-maroon w-full sm:w-auto"
          >
            <X size={16} className="mr-2" /> Cancel
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              type="button"
              onClick={() => handleSubmit('declined')}
              variant="outline"
              className="border-red-300 hover:bg-red-50 text-red-600 flex-1 sm:flex-auto"
            >
              <XIcon size={16} className="mr-2" />
              Decline
            </Button>
            
            <Button 
              type="button"
              onClick={() => handleSubmit('accepted')}
              disabled={isSubmitting}
              className="bg-wedding-gold hover:bg-wedding-deep-gold text-white flex-1 sm:flex-auto"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Accept
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;