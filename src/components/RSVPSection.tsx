import React, { useState } from 'react';
import { Heart } from 'lucide-react';
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
      <section className="w-full py-20 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
        {/* Royal background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
        <div className="absolute top-20 left-20 w-3 h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-4 h-4 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-wedding-gold/20 text-center">
            <div className="mb-8">
              <Heart className="w-16 h-16 text-wedding-gold mx-auto mb-6 animate-pulse" />
              <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-maroon mb-4">
                Thank You!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your RSVP has been received. We look forward to celebrating with you on our special day!
              </p>
            </div>
            <div className="pt-6 border-t border-wedding-gold/20">
              <p className="font-great-vibes text-xl text-wedding-gold italic">
                "Your presence will make our celebration complete"
              </p>
            </div>
          </div>
        </div>
      </section>
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
    <section className="w-full py-20 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
      {/* Royal background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      <div className="absolute top-20 left-20 w-3 h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-24 right-24 w-4 h-4 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-wedding-gold/20 text-center">
          <div className="mb-8">
            <h2 className="font-great-vibes text-4xl md:text-5xl text-wedding-maroon mb-6">
              Your Presence is Our Present
            </h2>
            <p className="text-lg text-wedding-gold font-medium mb-8 max-w-2xl mx-auto">
              Please confirm your attendance to make our day complete
            </p>
          </div>

          {rsvpConfig === 'simple' ? (
            <Button
              onClick={handleSimpleAccept}
              className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-wedding-gold/30"
            >
              <Heart className="w-5 h-5 mr-2" />
              Accept Invitation
            </Button>
          ) : (
            <Button
              onClick={handleDetailedAccept}
              className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-wedding-gold/30"
            >
              <Heart className="w-5 h-5 mr-2" />
              Yes, I'll attend
            </Button>
          )}

          <div className="mt-8 pt-6 border-t border-wedding-gold/20">
            <p className="font-great-vibes text-xl text-wedding-maroon italic">
              "A wedding is a celebration of love, and we want to celebrate with you"
            </p>
          </div>
        </div>
      </div>

      {/* Detailed RSVP Form Dialog */}
      <Dialog open={showDetailedForm} onOpenChange={(open) => {
        if (!open) {
          setShowDetailedForm(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border border-wedding-gold/30">
          <DialogHeader>
            <DialogTitle className="text-center text-wedding-maroon font-great-vibes text-2xl">
              RSVP Details
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="attendees" className="text-wedding-maroon font-medium">Number of Attendees *</Label>
              <Input
                id="attendees"
                type="number"
                min="1"
                max="10"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                required
                className="border-wedding-gold/30 focus:border-wedding-gold"
              />
            </div>

            <div>
              <Label htmlFor="dietary" className="text-wedding-maroon font-medium">Dietary Requirements</Label>
              <Textarea
                id="dietary"
                placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                rows={3}
                className="border-wedding-gold/30 focus:border-wedding-gold"
              />
            </div>

            <div>
              <Label htmlFor="requests" className="text-wedding-maroon font-medium">Special Requests</Label>
              <Textarea
                id="requests"
                placeholder="e.g., Wheelchair access, Seating preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="border-wedding-gold/30 focus:border-wedding-gold"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10"
                onClick={() => {
                  setShowDetailedForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-wedding-gold to-wedding-gold/90 hover:from-wedding-gold/90 hover:to-wedding-gold text-white"
              >
                Submit RSVP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};