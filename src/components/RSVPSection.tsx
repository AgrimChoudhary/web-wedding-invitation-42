import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Confetti } from './AnimatedElements';
import { DynamicFormField } from './DynamicFormField';
import { CustomField } from '../types/platform';

export const RSVPSection: React.FC = () => {
  const { 
    guestStatus, 
    existingRsvpData, 
    rsvpConfig, 
    sendRSVP, 
    isPlatformMode, 
    platformData 
  } = usePlatform();
  const { toast } = useToast();
  
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get guest name from platform data or fallback
  const guestName = platformData?.guestName || platformData?.structuredData?.guestName || "Guest";
  
  // Get custom fields with fallback and proper sorting
  const getCustomFields = (): CustomField[] => {
    if (!platformData?.customFields || !Array.isArray(platformData.customFields)) {
      return [];
    }
    
    // Sort by display_order, placing fields without order at the end
    return [...platformData.customFields].sort((a, b) => {
      const orderA = a.display_order ?? 999;
      const orderB = b.display_order ?? 999;
      return orderA - orderB;
    });
  };

  const customFields = getCustomFields();

  // Debug logging for modal state
  useEffect(() => {
    console.log('🔍 RSVP Modal State Debug:', {
      showDetailedForm,
      guestStatus,
      rsvpConfig,
      customFieldsCount: customFields.length,
      isPlatformMode
    });
  }, [showDetailedForm, guestStatus, rsvpConfig, customFields, isPlatformMode]);

  // Load existing RSVP data when available
  useEffect(() => {
    if (existingRsvpData && typeof existingRsvpData === 'object') {
      const initialData: Record<string, string> = {};
      
      // Populate form data with existing values
      customFields.forEach(field => {
        const existingValue = existingRsvpData[field.field_name];
        if (existingValue !== undefined) {
          initialData[field.field_name] = String(existingValue);
        }
      });
      
      setFormData(initialData);
    }
  }, [existingRsvpData, customFields]);

  // Clear validation errors when reopening form after successful submission
  useEffect(() => {
    if (showDetailedForm && guestStatus === 'submitted') {
      setValidationErrors({});
    }
  }, [showDetailedForm, guestStatus]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    customFields.forEach(field => {
      const value = formData[field.field_name] || '';
      
      // Required field validation
      if (field.is_required && !value.trim()) {
        errors[field.field_name] = `${field.field_label} is required.`;
        return;
      }
      
      // Email validation
      if (field.field_type === 'email' && value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          errors[field.field_name] = 'Please enter a valid email address.';
          return;
        }
      }
      
      // Max length validation
      if (field.max_length && value.length > field.max_length) {
        errors[field.field_name] = `Maximum ${field.max_length} characters allowed.`;
        return;
      }
      
      // Number validation
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
      // Convert form data to the format expected by the platform
      const rsvpData: Record<string, any> = {};
      
      customFields.forEach(field => {
        const value = formData[field.field_name];
        if (value !== undefined && value !== '') {
          // Convert to appropriate type based on field type
          if (field.field_type === 'number') {
            rsvpData[field.field_name] = parseFloat(value) || 0;
          } else {
            rsvpData[field.field_name] = value.trim();
          }
        }
      });

      sendRSVP(rsvpData);
      setShowDetailedForm(false);
      setShowConfetti(true);
      
      toast({
        title: guestStatus === 'submitted' ? "RSVP Updated" : "RSVP Submitted",
        description: isPlatformMode 
          ? `Thank you ${guestName}! Your RSVP has been ${guestStatus === 'submitted' ? 'updated' : 'sent'} successfully.`
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

  const getThankYouMessage = () => {
    if (rsvpConfig === 'simple') {
      return "Thank you for accepting our invitation! We look forward to celebrating with you.";
    }
    
    if (guestStatus === 'accepted') {
      return "Thank you for accepting! Please provide additional details to help us plan better.";
    }
    
    return "Thank you for your RSVP! We have received your details and look forward to celebrating with you.";
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return guestStatus === 'submitted' ? 'Updating...' : 'Submitting...';
    }
    return guestStatus === 'submitted' ? 'Edit RSVP' : 'Submit RSVP';
  };

  // Show thank you message for accepted or submitted states
  // Only show if user has explicitly accepted (not from platform data)
  if (guestStatus === 'accepted' || guestStatus === 'submitted') {
    return (
      <>
        <Confetti isActive={showConfetti} />
        <section className="w-full py-8 md:py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
          {/* Elegant royal pattern background */}
          <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10" 
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--wedding-gold)) 2px, transparent 2px), 
                                   radial-gradient(circle at 75% 75%, hsl(var(--wedding-maroon)) 1px, transparent 1px)`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
          
          <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center relative overflow-hidden">
              {/* Luxury gold accent borders */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-wedding-gold/40 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-wedding-gold/40 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-wedding-gold/40 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-wedding-gold/40 rounded-br-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-center items-center mb-4 md:mb-6">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-wedding-gold animate-pulse mr-3" />
                  <Heart className="w-10 h-10 md:w-14 md:h-14 text-wedding-gold animate-pulse" />
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-wedding-gold animate-pulse ml-3" />
                </div>
                
                {/* Personalized Thank You Message */}
                <div className="mb-5 md:mb-6">
                  <h2 className="font-great-vibes text-2xl md:text-4xl lg:text-5xl text-wedding-maroon mb-2 md:mb-3">
                    Dear <span className="text-wedding-gold bg-gradient-to-r from-wedding-gold to-wedding-gold/80 bg-clip-text text-transparent">{guestName}</span>,
                  </h2>
                  <h3 className="font-great-vibes text-xl md:text-3xl lg:text-4xl text-wedding-maroon mb-3">
                    Thank You for Accepting!
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto text-left mb-6">
                  <div className="bg-wedding-gold/5 p-4 md:p-6 rounded-2xl border border-wedding-gold/20">
                    <p className="text-base md:text-lg text-gray-700 font-medium mb-2">
                      🎉 We are absolutely thrilled!
                    </p>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {getThankYouMessage()}
                    </p>
                  </div>
                  
                  <div className="bg-wedding-maroon/5 p-4 md:p-6 rounded-2xl border border-wedding-maroon/20">
                    <p className="text-base md:text-lg text-wedding-maroon font-medium mb-2">
                      💝 Save the Date!
                    </p>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      Get ready for an unforgettable celebration of love, tradition, and togetherness.
                    </p>
                  </div>
                </div>

                {/* Show Submit/Edit RSVP button for detailed RSVP config */}
                {rsvpConfig === 'detailed' && (
                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={() => {
                        console.log('🔘 Submit RSVP Details button clicked - opening modal');
                        setShowDetailedForm(true);
                      }}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-wedding-gold/30 min-h-[56px] group"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {getButtonText()}
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 group-hover:animate-pulse" />
                          {getButtonText()}
                          <Sparkles className="w-4 h-4 ml-2 opacity-70" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                <div className="pt-5 border-t border-wedding-gold/20">
                  <p className="font-great-vibes text-lg md:text-2xl text-wedding-gold italic">
                    "Your presence will make our celebration complete"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed RSVP Form Dialog */}
        <Dialog open={showDetailedForm} onOpenChange={(open) => {
          console.log('🔍 Dialog onOpenChange called:', { open, showDetailedForm });
          if (!open) {
            setShowDetailedForm(false);
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
              {customFields.length > 0 ? (
                customFields.map((field) => (
                  <DynamicFormField
                    key={field.field_name}
                    field={field}
                    value={formData[field.field_name] || ''}
                    onChange={(value) => 
                      setFormData(prev => ({ ...prev, [field.field_name]: value }))
                    }
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
                  onClick={() => setShowDetailedForm(false)}
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
                      {getButtonText()}
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      {getButtonText()}
                    </>
                  )}
                </Button>
              </div>

              {/* Retry button for errors */}
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

  // Show initial RSVP invitation (invited state)
  const handleSimpleAccept = async () => {
    setIsSubmitting(true);
    try {
      sendRSVP();
      setShowConfetti(true);
      toast({
        title: "RSVP Confirmed",
        description: `Thank you ${guestName} for accepting the invitation!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedAccept = async () => {
    setIsSubmitting(true);
    try {
      sendRSVP(); // Send simple acceptance first
      setShowConfetti(true);
      toast({
        title: "Invitation Accepted",
        description: `Thank you ${guestName}! Please provide additional details.`,
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


  return (
    <section className="w-full py-8 md:py-12 bg-gradient-to-br from-wedding-cream/60 via-wedding-blush/10 to-wedding-cream/60 relative overflow-hidden">
      {/* Luxury royal pattern background */}
      <div className="absolute inset-0 bg-gradient-to-br from-wedding-gold/5 via-transparent to-wedding-maroon/5"></div>
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: `radial-gradient(circle at 20% 20%, hsl(var(--wedding-gold)) 2px, transparent 2px), 
                               radial-gradient(circle at 80% 80%, hsl(var(--wedding-maroon)) 1px, transparent 1px)`,
             backgroundSize: '80px 80px'
           }}>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center relative overflow-hidden">
          {/* Elegant corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-3 border-t-3 border-wedding-gold/30 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r-3 border-t-3 border-wedding-gold/30 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-3 border-b-3 border-wedding-gold/30 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-3 border-b-3 border-wedding-gold/30 rounded-br-3xl"></div>
          
          <div className="relative z-10">
            <div className="mb-5 md:mb-6">
              <div className="flex justify-center items-center mb-3 md:mb-4">
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-wedding-gold animate-pulse mr-3" />
                <Heart className="w-8 h-8 md:w-12 md:h-12 text-wedding-gold animate-pulse" />
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-wedding-gold animate-pulse ml-3" />
              </div>
              
              <h2 className="font-great-vibes text-2xl md:text-4xl lg:text-5xl text-wedding-maroon mb-3 md:mb-4">
                Your Presence is Our Present
              </h2>
              <p className="text-base md:text-lg text-wedding-gold font-medium mb-5 md:mb-6 max-w-3xl mx-auto">
                Please confirm your attendance to make our day complete
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-6">
              {rsvpConfig === 'simple' ? (
                <Button
                  onClick={handleSimpleAccept}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-wedding-gold/30 min-h-[56px] group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 group-hover:animate-pulse" />
                      Accept Invitation
                      <Sparkles className="w-4 h-4 ml-2 opacity-70" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleDetailedAccept}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-wedding-gold via-wedding-gold/90 to-wedding-gold hover:from-wedding-gold/90 hover:to-wedding-gold hover:via-wedding-gold text-white font-semibold px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-wedding-gold/30 min-h-[56px] group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 md:w-6 md:h-6 mr-2 group-hover:animate-pulse" />
                      Accept Invitation
                      <Sparkles className="w-4 h-4 ml-2 opacity-70" />
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="pt-4 border-t border-wedding-gold/20">
              <p className="font-great-vibes text-base md:text-xl text-wedding-maroon italic">
                "A wedding is a celebration of love, and we want to celebrate with you"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};