import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Heart, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { usePlatformRSVP } from "../hooks/usePlatformRSVP";

const RSVPModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [attendees, setAttendees] = useState("");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<'pending' | 'accepted'>('pending');
  const { toast } = useToast();
  const { submitRSVP, isPlatformMode } = usePlatformRSVP();

  const handleAccept = () => {
    const attendeesCount = parseInt(attendees);
    
    if (!attendees || attendeesCount < 1) {
      toast({
        title: "Invalid input",
        description: "Please enter the number of attendees.",
        variant: "destructive",
      });
      return;
    }

    const rsvpData = {
      attendees: attendeesCount,
      dietary_requirements: dietaryRequirements || undefined,
      special_requests: specialRequests || undefined
    };

    const success = submitRSVP(rsvpData);
    
    if (success) {
      setRsvpStatus('accepted');
      // Additional success handling is done in usePlatformRSVP hook
    }
  };

  const resetForm = () => {
    setAttendees("");
    setDietaryRequirements("");
    setSpecialRequests("");
    setRsvpStatus('pending');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <Heart className="w-5 h-5 mr-2" />
          RSVP Now
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background/95 to-primary/5 border-2 border-primary/20">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-3xl font-bold text-primary mb-2">
            Join Our Celebration
          </DialogTitle>
          <p className="text-muted-foreground text-lg">
            Your presence would make our day even more special
          </p>
        </DialogHeader>

        {rsvpStatus === 'pending' && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendees" className="text-base font-semibold">
                  Number of Attendees
                </Label>
                <Input
                  id="attendees"
                  type="number"
                  min="1"
                  max="10"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="Enter number of guests"
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dietary" className="text-base font-semibold">
                  Dietary Requirements (Optional)
                </Label>
                <Input
                  id="dietary"
                  value={dietaryRequirements}
                  onChange={(e) => setDietaryRequirements(e.target.value)}
                  placeholder="Vegetarian, Vegan, Allergies, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requests" className="text-base font-semibold">
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Accessibility needs, seating preferences, etc."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleAccept}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept with Joy
                </Button>
                
                {!isPlatformMode && (
                  <Button 
                    onClick={() => setRsvpStatus('accepted')}
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white font-semibold py-3"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Regretfully Decline
                  </Button>
                )}
              </div>
              
              {isPlatformMode && (
                <p className="text-sm text-muted-foreground text-center">
                  Note: Only RSVP acceptance is available in platform mode.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {rsvpStatus === 'accepted' && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                RSVP Confirmed!
              </h3>
              <p className="text-green-700 mb-4">
                Thank you for confirming your attendance for {attendees} guest{parseInt(attendees) > 1 ? 's' : ''}.
              </p>
              {(dietaryRequirements || specialRequests) && (
                <div className="text-sm text-green-600 bg-white p-3 rounded-lg space-y-2">
                  {dietaryRequirements && (
                    <p><strong>Dietary Requirements:</strong> {dietaryRequirements}</p>
                  )}
                  {specialRequests && (
                    <p><strong>Special Requests:</strong> {specialRequests}</p>
                  )}
                </div>
              )}
              {isPlatformMode && (
                <p className="text-xs text-green-600 mt-2">
                  Your RSVP has been sent to the wedding organizers.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;