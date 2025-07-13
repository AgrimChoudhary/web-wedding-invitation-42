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
  const { hasResponded, rsvpConfig, sendRSVP, isPlatformMode, platformData } = usePlatform();
  const { toast } = useToast();
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [attendees, setAttendees] = useState(1);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [justAccepted, setJustAccepted] = useState(false);

  // Get guest name from platform data or fallback
  const guestName = platformData?.guestName || platformData?.structuredData?.guestName || "Guest";

  // If guest has already responded or just accepted, show thank you message
  if (hasResponded || justAccepted) {
    return (
      <section className="w-full py-12 md:py-20 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
        {/* Royal background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
        <div className="absolute top-10 md:top-20 left-10 md:left-20 w-2 h-2 md:w-3 md:h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-12 md:bottom-24 right-12 md:right-24 w-3 h-3 md:w-4 md:h-4 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-16 md:top-32 right-16 md:right-32 w-1 h-1 md:w-2 md:h-2 bg-wedding-gold/50 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border border-wedding-gold/20 text-center">
            <div className="mb-6 md:mb-8">
              <Heart className="w-12 h-12 md:w-16 md:h-16 text-wedding-gold mx-auto mb-4 md:mb-6 animate-pulse" />
              
              {/* Personalized Thank You Message */}
              <div className="mb-4 md:mb-6">
                <h2 className="font-great-vibes text-2xl md:text-4xl lg:text-5xl text-wedding-maroon mb-2 md:mb-4">
                  Dear <span className="text-wedding-gold">{guestName}</span>,
                </h2>
                <h3 className="font-great-vibes text-xl md:text-3xl lg:text-4xl text-wedding-maroon">
                  Thank You for Accepting!
                </h3>
              </div>
              
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
                We are extremely excited to celebrate our special day with you!
              </p>
              
              <p className="text-sm md:text-base text-wedding-maroon italic font-medium max-w-xl mx-auto leading-relaxed">
                We are truly honored to have you join us in our celebration of love and commitment.
              </p>
            </div>
            
            <div className="pt-4 md:pt-6 border-t border-wedding-gold/20">
              <p className="font-great-vibes text-lg md:text-xl text-wedding-gold italic">
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
    setJustAccepted(true);
    toast({
      title: "RSVP Confirmed",
      description: `Thank you ${guestName} for accepting the invitation!`,
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
    setJustAccepted(true);
    
    toast({
      title: "RSVP Submitted",
      description: isPlatformMode 
        ? `Thank you ${guestName}! Your RSVP has been sent successfully.`
        : `Thank you ${guestName}! Your RSVP has been recorded (demo mode).`,
    });
  };

  const resetForm = () => {
    setAttendees(1);
    setDietaryRequirements('');
    setSpecialRequests('');
  };

  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
      {/* Royal background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      <div className="absolute top-10 md:top-20 left-10 md:left-20 w-2 h-2 md:w-3 md:h-3 bg-wedding-gold/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-12 md:bottom-24 right-12 md:right-24 w-3 h-3 md:w-4 md:h-4 bg-wedding-maroon/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-16 md:top-32 right-16 md:right-32 w-1 h-1 md:w-2 md:h-2 bg-wedding-gold/50 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border border-wedding-gold/20 text-center">
          <div className="mb-6 md:mb-8">
            <h2 className="font-great-vibes text-2xl md:text-4xl lg:text-5xl text-wedding-maroon mb-4 md:mb-6">
              Your Presence is Our Present
            </h2>
            <p className="text-base md:text-lg text-wedding-gold font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
              Please confirm your attendance to make our day complete
            </p>
          </div>

          {rsvpConfig === 'simple' ? (
            <Button
              onClick={handleSimpleAccept}
              className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-wedding-gold/30 w-full max-w-xs mx-auto"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Accept Invitation
            </Button>
          ) : (
            <Button
              onClick={handleDetailedAccept}
              className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-wedding-gold/30 w-full max-w-xs mx-auto"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Yes, I'll attend
            </Button>
          )}

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-wedding-gold/20">
            <p className="font-great-vibes text-base md:text-xl text-wedding-maroon italic">
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
        <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-wedding-gold/30 rounded-2xl">
          <DialogHeader className="text-center mb-4">
            <DialogTitle className="text-center text-wedding-maroon font-great-vibes text-xl md:text-2xl">
              RSVP Details
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Please provide your details for a better celebration experience
            </p>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <Label htmlFor="attendees" className="text-wedding-maroon font-medium text-sm">
                Number of Attendees *
              </Label>
              <Input
                id="attendees"
                type="number"
                min="1"
                max="10"
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                required
                className="mt-1 border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg"
                placeholder="How many guests will attend?"
              />
            </div>

            <div>
              <Label htmlFor="dietary" className="text-wedding-maroon font-medium text-sm">
                Dietary Requirements
              </Label>
              <Textarea
                id="dietary"
                placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies..."
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                rows={3}
                className="mt-1 border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg resize-none"
              />
            </div>

            <div>
              <Label htmlFor="requests" className="text-wedding-maroon font-medium text-sm">
                Special Requests
              </Label>
              <Textarea
                id="requests"
                placeholder="e.g., Wheelchair access, Seating preferences..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="mt-1 border-wedding-gold/30 focus:border-wedding-gold focus:ring-wedding-gold/20 rounded-lg resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10 rounded-lg py-2.5"
                onClick={() => {
                  setShowDetailedForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-wedding-gold to-wedding-gold/90 hover:from-wedding-gold/90 hover:to-wedding-gold text-white rounded-lg py-2.5 font-semibold"
              >
                <Heart className="w-4 h-4 mr-2" />
                Submit RSVP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};