import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

export const RSVPSection: React.FC = () => {
  const { hasResponded, rsvpConfig, sendRSVP, isPlatformMode } = usePlatform();
  const { toast } = useToast();
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [attendees, setAttendees] = useState(1);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // If guest has already responded, show thank you message
  if (hasResponded) {
    return (
      <div className="text-center p-8 bg-card rounded-lg border">
        <h3 className="text-xl font-semibold text-primary mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your RSVP has been received. We look forward to celebrating with you!
        </p>
      </div>
    );
  }

  const handleSimpleAccept = () => {
    sendRSVP();
    toast({
      title: "RSVP Confirmed",
      description: "Thank you for accepting the invitation!",
    });
  };

  const handleDetailedAccept = () => {
    setShowDetailedForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attendees < 1) {
      toast({
        title: "Invalid Input",
        description: "Please specify at least 1 attendee.",
        variant: "destructive"
      });
      return;
    }

    const rsvpData = {
      attendees,
      dietary_requirements: dietaryRequirements.trim() || undefined,
      special_requests: specialRequests.trim() || undefined
    };

    sendRSVP(rsvpData);
    setShowDetailedForm(false);
    
    toast({
      title: "RSVP Submitted",
      description: isPlatformMode 
        ? "Your RSVP has been sent successfully."
        : "Your RSVP has been recorded (demo mode).",
    });
  };

  const resetForm = () => {
    setAttendees(1);
    setDietaryRequirements('');
    setSpecialRequests('');
  };

  return (
    <div className="text-center p-8 bg-card rounded-lg border">
      <h3 className="text-xl font-semibold text-primary mb-4">
        {rsvpConfig === 'simple' ? 'Invitation Response' : 'RSVP Required'}
      </h3>
      
      {rsvpConfig === 'simple' ? (
        <Button
          onClick={handleSimpleAccept}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
          ✅ Accept Invitation
        </Button>
      ) : (
        <Button
          onClick={handleDetailedAccept}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
          ✅ Yes, I'll attend
        </Button>
      )}

      {/* Detailed RSVP Form Dialog */}
      <Dialog open={showDetailedForm} onOpenChange={(open) => {
        if (!open) {
          setShowDetailedForm(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-primary">
              RSVP Details
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="attendees">Number of Attendees *</Label>
              <Input
                id="attendees"
                type="number"
                min="1"
                max="10"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div>
              <Label htmlFor="dietary">Dietary Requirements</Label>
              <Textarea
                id="dietary"
                placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="requests">Special Requests</Label>
              <Textarea
                id="requests"
                placeholder="e.g., Wheelchair access, Seating preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDetailedForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Submit RSVP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};