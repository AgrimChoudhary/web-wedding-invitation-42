import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Confetti } from './AnimatedElements';
import { DynamicFormField } from './DynamicFormField';
import { CustomField } from '../types/platform';
import { DeadlineDisplay } from './DeadlineDisplay';

export const RSVPSection: React.FC = () => {
  const { 
    guestStatus, 
    existingRsvpData, 
    rsvpConfig, 
    sendRSVP, 
    sendRSVPUpdate,
    sendInvitationViewed,
    isPlatformMode, 
    platformData,
    canSubmitRSVP,
    canEditRSVP,
    rsvpClosed,
    deadlineMessage
  } = usePlatform();
  const { toast } = useToast();
  
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [localGuestStatus, setLocalGuestStatus] = useState(guestStatus);

  // Get guest name from platform data
  const guestName = platformData?.guestName || platformData?.structuredData?.guestName || "Guest";
  
  // Get custom fields with proper sorting
  const getCustomFields = (): CustomField[] => {
    if (!platformData?.customFields || !Array.isArray(platformData.customFields)) {
      return [];
    }
    
    return [...platformData.customFields].sort((a, b) => {
      const orderA = a.display_order ?? 999;
      const orderB = b.display_order ?? 999;
      return orderA - orderB;
    });
  };

  const customFields = getCustomFields();

  // Auto-send viewed status on component mount
  useEffect(() => {
    if (sendInvitationViewed) {
      sendInvitationViewed();
    }
  }, [sendInvitationViewed]);

  // Update local status when platform status changes
  useEffect(() => {
    setLocalGuestStatus(guestStatus);
  }, [guestStatus]);

  // Load existing RSVP data when available
  useEffect(() => {
    if (existingRsvpData && typeof existingRsvpData === 'object') {
      const initialData: Record<string, string> = {};
      
      customFields.forEach(field => {
        const existingValue = existingRsvpData[field.field_name];
        if (existingValue !== undefined) {
          initialData[field.field_name] = String(existingValue);
        }
      });
      
      setFormData(initialData);
    }
  }, [existingRsvpData, customFields]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    customFields.forEach(field => {
      const value = formData[field.field_name] || '';
      
      if (field.is_required && !value.trim()) {
        errors[field.field_name] = `${field.field_label} is required.`;
        return;
      }
      
      if (field.field_type === 'email' && value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errors[field.field_name] = 'Please enter a valid email address.';
          return;
        }
      }
      
      if (field.max_length && value.length > field.max_length) {
        errors[field.field_name] = `Maximum ${field.max_length} characters allowed.`;
        return;
      }
      
      if (field.field_type === 'number' && value.trim()) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          errors[field.field_name] = 'Please enter a valid number.';
          return;
        }
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const rsvpData: Record<string, any> = {};
      
      customFields.forEach(field => {
        const value = formData[field.field_name];
        if (value !== undefined && value !== '') {
          if (field.field_type === 'number') {
            rsvpData[field.field_name] = parseFloat(value) || 0;
          } else {
            rsvpData[field.field_name] = value.trim();
          }
        }
      });

      // Use appropriate handler based on mode
      if (isEditMode) {
        sendRSVPUpdate(rsvpData);
      } else {
        sendRSVP(rsvpData);
      }
      
      setShowDetailedForm(false);
      setShowConfetti(true);
      setIsEditMode(false);
      
      // Update local status if not in edit mode
      if (!isEditMode) {
        setLocalGuestStatus('submitted');
      }
      
      toast({
        title: isEditMode ? "RSVP Updated" : "RSVP Submitted",
        description: isPlatformMode 
          ? `Thank you ${guestName}! Your RSVP has been ${isEditMode ? 'updated' : 'submitted'} successfully.`
          : `Thank you ${guestName}! Your RSVP has been recorded (demo mode).`,
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "RSVP Failed",
        description: "There was an error submitting your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle accept invitation
  const handleAcceptInvitation = async () => {
    setIsSubmitting(true);
    try {
      sendRSVP();
      setLocalGuestStatus('accepted');
      setShowConfetti(true);
      toast({
        title: "Invitation Accepted",
        description: `Thank you ${guestName} for accepting the invitation!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit RSVP
  const handleEditRSVP = () => {
    setIsEditMode(true);
    setShowDetailedForm(true);
  };

  // Handle submit RSVP details
  const handleSubmitRSVP = () => {
    setIsEditMode(false);
    setShowDetailedForm(true);
  };

  // RSVP is closed - show deadline message
  if (rsvpClosed) {
    return (
      <section className="w-full py-8 md:py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center">
            <DeadlineDisplay rsvpClosed={rsvpClosed} deadlineMessage={deadlineMessage} className="mb-6" />
          </div>
        </div>
      </section>
    );
  }

  // Status: pending - No UI for pending, platform handles this state
  if (localGuestStatus === 'pending') {
    return null;
  }

  // Status: viewed - Show accept invitation button
  if (localGuestStatus === 'viewed') {
    return (
      <section className="w-full py-8 md:py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
        
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center">
            
            <div className="flex justify-center items-center mb-6">
              <Sparkles className="w-8 h-8 text-wedding-gold animate-pulse mr-3" />
              <Heart className="w-12 h-12 text-wedding-gold animate-pulse" />
              <Sparkles className="w-8 h-8 text-wedding-gold animate-pulse ml-3" />
            </div>
            
            <h2 className="font-great-vibes text-3xl md:text-5xl text-wedding-maroon mb-4">
              Dear {guestName},
            </h2>
            <h3 className="font-great-vibes text-xl md:text-3xl text-wedding-maroon mb-6">
              Will You Join Our Celebration?
            </h3>
            
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Your presence would mean the world to us as we begin this new chapter together. Please let us know if you can join us on our special day.
            </p>

            {deadlineMessage && (
              <DeadlineDisplay rsvpClosed={rsvpClosed} deadlineMessage={deadlineMessage} className="mb-6" />
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleAcceptInvitation}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                {isSubmitting ? "Accepting..." : "Accept Invitation"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Status: accepted or submitted - Show thank you message with appropriate buttons
  if (localGuestStatus === 'accepted' || localGuestStatus === 'submitted') {
    return (
      <>
        <Confetti isActive={showConfetti} />
        <section className="w-full py-8 md:py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
          
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center relative overflow-hidden">
              
              <div className="relative z-10">
                <div className="flex justify-center items-center mb-4">
                  <Heart className="w-8 h-8 text-wedding-gold animate-pulse" />
                </div>
                
                <h3 className="font-great-vibes text-xl md:text-2xl text-wedding-maroon mb-4">
                  Thank you {guestName}!
                </h3>
                
                <p className="text-sm text-gray-600 mb-6">
                  We are looking forward to celebrate with you.
                </p>

                {deadlineMessage && (
                  <DeadlineDisplay rsvpClosed={rsvpClosed} deadlineMessage={deadlineMessage} className="mb-6" />
                )}

                {/* Show Submit RSVP button if accepted and can submit */}
                {(localGuestStatus === 'accepted' && canSubmitRSVP) && (
                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={handleSubmitRSVP}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold text-white font-semibold px-6 py-3 text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Loading..." : "Submit RSVP Details"}
                    </Button>
                  </div>
                )}

                {/* Show Edit RSVP button if submitted and can edit */}
                {(localGuestStatus === 'submitted' && canEditRSVP) && (
                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={handleEditRSVP}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-wedding-maroon via-wedding-maroon/90 to-wedding-maroon hover:from-wedding-maroon/90 hover:to-wedding-maroon text-white font-semibold px-6 py-3 text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Loading..." : "Edit RSVP Details"}
                    </Button>
                  </div>
                )}
                
                <div className="pt-6 border-t border-wedding-gold/20">
                  <p className="font-great-vibes text-xl text-wedding-gold italic">
                    "Your presence will make our celebration complete"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed RSVP Form Dialog */}
        <Dialog open={showDetailedForm} onOpenChange={(open) => {
          if (!open) {
            setShowDetailedForm(false);
            setIsEditMode(false);
          }
        }}>
          <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-wedding-gold/30 rounded-2xl">
            <DialogHeader className="text-center mb-4">
              <DialogTitle className="text-center text-wedding-maroon font-great-vibes text-2xl">
                {isEditMode ? 'Edit RSVP Details' : 'RSVP Details'}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-2">
                {isEditMode 
                  ? 'Update your details for a better celebration experience'
                  : 'Please provide your details for a better celebration experience'
                }
              </p>
            </DialogHeader>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {customFields.length > 0 ? (
                customFields.map((field) => (
                  <DynamicFormField
                    key={field.field_name}
                    field={field}
                    value={formData[field.field_name] || ''}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, [field.field_name]: value }));
                      // Clear validation error when user starts typing
                      if (validationErrors[field.field_name]) {
                        setValidationErrors(prev => ({
                          ...prev,
                          [field.field_name]: ''
                        }));
                      }
                    }}
                    error={validationErrors[field.field_name]}
                  />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No additional fields configured for this event.</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-gold/10 rounded-lg py-2.5"
                  onClick={() => {
                    setShowDetailedForm(false);
                    setIsEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-wedding-gold to-wedding-gold/90 hover:from-wedding-gold/90 hover:to-wedding-gold text-white rounded-lg py-2.5 font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Update RSVP' : 'Submit RSVP'}
                    </>
                  )}
                </Button>
              </div>

              {Object.keys(validationErrors).length > 0 && (
                <div className="text-center pt-2">
                  <p className="text-red-500 text-sm mb-2">Please correct the errors above</p>
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Fallback loading state
  return (
    <section className="w-full py-8 md:py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-wedding-gold/20 rounded mb-4"></div>
            <div className="h-4 bg-wedding-gold/10 rounded mb-2"></div>
            <div className="h-4 bg-wedding-gold/10 rounded mb-6"></div>
            <div className="h-12 bg-wedding-gold/20 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};