import { useCallback } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from './use-toast';

interface RSVPData {
  attendees: number;
  dietary_requirements?: string;
  special_requests?: string;
}

export const usePlatformRSVP = () => {
  const { isPlatformMode, sendRSVP } = usePlatform();
  const { toast } = useToast();

  const submitRSVP = useCallback((rsvpData: RSVPData) => {
    try {
      // Validate RSVP data
      if (!rsvpData.attendees || rsvpData.attendees < 1) {
        toast({
          title: "Invalid RSVP",
          description: "Please specify at least 1 attendee.",
          variant: "destructive"
        });
        return false;
      }

      // Send RSVP through platform integration
      sendRSVP(rsvpData);

      // Show success message
      toast({
        title: "RSVP Submitted",
        description: isPlatformMode 
          ? "Your RSVP has been sent to the platform successfully."
          : "Your RSVP has been recorded (demo mode).",
      });

      return true;
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "RSVP Failed",
        description: "There was an error submitting your RSVP. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [sendRSVP, isPlatformMode, toast]);

  return {
    submitRSVP,
    isPlatformMode
  };
};