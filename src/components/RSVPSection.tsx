import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Confetti } from './AnimatedElements';
import { RSVPFieldRenderer } from './RSVPFieldRenderer';
import { CustomField } from '../types/platform';

export const RSVPSection: React.FC = () => {
  const { 
    guestStatus, 
    existingRsvpData, 
    rsvpConfig, 
    sendRSVP, 
    isPlatformMode, 
    platformData,
    showEditButton
  } = usePlatform();
  const { toast } = useToast();
  
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Get guest name from platform data or fallback
  const guestName = platformData?.guestName || platformData?.structuredData?.guestName || "Guest";
  
  // Field type normalizer to handle various formats
  const normalizeFieldType = (fieldType: string): string => {
    const normalized = String(fieldType || "").trim().toLowerCase();
    if (["date & time", "datetime", "datetime-local"].includes(normalized)) return "datetime-local";
    if (["date"].includes(normalized)) return "date";
    if (["time"].includes(normalized)) return "time";
    if (["number", "numeric"].includes(normalized)) return "number";
    if (["select", "dropdown", "choice"].includes(normalized)) return "select";
    if (["boolean", "checkbox", "toggle"].includes(normalized)) return "checkbox";
    if (["email"].includes(normalized)) return "email";
    if (["phone", "tel"].includes(normalized)) return "tel";
    if (["textarea", "multiline"].includes(normalized)) return "textarea";
    return "text";
  };

  // Get custom fields with fallback and proper sorting
  const getCustomFields = (): CustomField[] => {
    if (!platformData?.customFields || !Array.isArray(platformData.customFields)) {
      console.warn("[RSVP] No customFields found in platformData");
      return [];
    }
    
    // Debug logging for field types
    console.debug("[RSVP] Raw custom fields:", platformData.customFields);
    
    const normalizedFields = platformData.customFields.map(field => {
      const originalType = field.field_type;
      const normalizedType = normalizeFieldType(originalType);
      
      if (!originalType) {
        console.warn(`[RSVP] Missing fieldType for ${field.field_name}, falling back to text`);
      }
      
      console.debug(`[RSVP] Field ${field.field_name}: ${originalType} → ${normalizedType}`);
      
      return {
        ...field,
        field_type: normalizedType as any
      };
    });
    
    // Sort by display_order, placing fields without order at the end
    const sortedFields = [...normalizedFields].sort((a, b) => {
      const orderA = a.display_order ?? 999;
      const orderB = b.display_order ?? 999;
      return orderA - orderB;
    });

    // Log field summary
    const fieldTypeCounts = sortedFields.reduce((acc, field) => {
      acc[field.field_type] = (acc[field.field_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.debug("[RSVP] Field type summary:", fieldTypeCounts);
    
    return sortedFields;
  };

  const customFields = useMemo(() => getCustomFields(), [platformData?.customFields]);

  // Debug logging for incoming data
  useEffect(() => {
    console.debug("[RSVP] Incoming platform data:", {
      platformData,
      customFields: platformData?.customFields,
      rsvpFields: platformData?.customFields,
      customFieldsCount: customFields.length
    });
    
    // Sample field debugging
    if (customFields.length > 0) {
      const sampleField = customFields.find(f => f.field_name.toLowerCase().includes('arrival') || f.field_name.toLowerCase().includes('time')) || customFields[0];
      console.debug("[RSVP] Sample field properties:", {
        fieldLabel: sampleField.field_label,
        fieldName: sampleField.field_name,
        fieldType: sampleField.field_type,
        placeholder: sampleField.placeholder_text,
        required: sampleField.is_required
      });
    }
    
    console.debug('🔍 RSVP Modal State Debug:', {
      showDetailedForm,
      guestStatus,
      rsvpConfig,
      customFieldsCount: customFields.length,
      isPlatformMode,
      showEditButton
    });
    
    // Additional debug for RSVP button logic
    if (guestStatus === 'submitted' || guestStatus === 'accepted') {
      console.log('🎯 RSVP Button Logic Debug:', {
        guestStatus,
        rsvpConfig,
        showEditButton,
        showEditButtonType: typeof showEditButton,
        showEditButtonBoolean: Boolean(showEditButton),
        willShowButton: rsvpConfig === 'detailed' && (
          guestStatus === 'accepted' || 
          (guestStatus === 'submitted' && Boolean(showEditButton))
        ),
        reason: guestStatus === 'accepted' ? 'Initial submit - always show' : 
               guestStatus === 'submitted' && Boolean(showEditButton) ? 'Edit allowed - show button' : 
               'Edit not allowed - hide button'
      });
    }
  }, [showDetailedForm, guestStatus, rsvpConfig, customFields, isPlatformMode, showEditButton]);

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

      // Date validation
      if (field.field_type === 'date' && value.trim()) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value.trim())) {
          errors[field.field_name] = 'Please enter a valid date.';
          return;
        }
      }

      // Time validation
      if (field.field_type === 'time' && value.trim()) {
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(value.trim())) {
          errors[field.field_name] = 'Please enter a valid time.';
          return;
        }
      }

      // DateTime validation
      if (field.field_type === 'datetime-local' && value.trim()) {
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (!dateTimeRegex.test(value.trim())) {
          errors[field.field_name] = 'Please enter a valid date and time.';
          return;
        }
      }

      // Phone/tel validation
      if (field.field_type === 'tel' && value.trim()) {
        // Basic phone validation - at least 10 digits
        const phoneRegex = /[\d\-\+\(\)\s]{10,}/;
        if (!phoneRegex.test(value.trim())) {
          errors[field.field_name] = 'Please enter a valid phone number.';
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
          } else if (field.field_type === 'checkbox') {
            rsvpData[field.field_name] = value === 'true';
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
          
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-8 relative z-10">
            <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center relative overflow-hidden">
              {/* Mobile-optimized corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 border-l-2 sm:border-l-3 md:border-l-4 border-t-2 sm:border-t-3 md:border-t-4 border-wedding-gold/40 rounded-tl-2xl sm:rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 border-r-2 sm:border-r-3 md:border-r-4 border-t-2 sm:border-t-3 md:border-t-4 border-wedding-gold/40 rounded-tr-2xl sm:rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 border-l-2 sm:border-l-3 md:border-l-4 border-b-2 sm:border-b-3 md:border-b-4 border-wedding-gold/40 rounded-bl-2xl sm:rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 border-r-2 sm:border-r-3 md:border-r-4 border-b-2 sm:border-b-3 md:border-b-4 border-wedding-gold/40 rounded-br-2xl sm:rounded-br-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-center items-center mb-3 sm:mb-4 md:mb-6">
                  <Sparkles className="w-4 h-4 sm:w-6 md:w-8 sm:h-6 md:h-8 text-wedding-gold animate-pulse mr-2 sm:mr-3" />
                  <Heart className="w-8 h-8 sm:w-10 md:w-14 sm:h-10 md:h-14 text-wedding-gold animate-pulse" />
                  <Sparkles className="w-4 h-4 sm:w-6 md:w-8 sm:h-6 md:h-8 text-wedding-gold animate-pulse ml-2 sm:ml-3" />
                </div>
                
                {/* Mobile-optimized Thank You Message */}
                <div className="mb-4 sm:mb-5 md:mb-6 px-2">
                  <h2 className="font-great-vibes text-xl sm:text-2xl md:text-4xl lg:text-5xl text-wedding-maroon mb-2 sm:mb-2 md:mb-3 leading-tight">
                    Dear <span className="text-wedding-gold bg-gradient-to-r from-wedding-gold to-wedding-gold/80 bg-clip-text text-transparent break-words">{guestName}</span>,
                  </h2>
                  <h3 className="font-great-vibes text-lg sm:text-xl md:text-3xl lg:text-4xl text-wedding-maroon mb-2 sm:mb-3 leading-tight">
                    Thank You for Accepting!
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    {getThankYouMessage()}
                  </p>
                </div>
                

                {/* Show Submit/Edit RSVP button for detailed RSVP config */}
                {/* Show button for initial submit (accepted) OR for edit if showEditButton is true */}
                {(() => {
                  // CRITICAL DEBUG: Log all values to understand what's happening
                  console.log('🔍 CRITICAL DEBUG - All RSVP Values:', {
                    rsvpConfig,
                    guestStatus,
                    showEditButton,
                    showEditButtonType: typeof showEditButton,
                    showEditButtonBoolean: Boolean(showEditButton),
                    customFieldsCount: customFields.length
                  });
                  
                  // SIMPLE LOGIC: Only show button for initial submit OR if edit is allowed
                  let shouldShowButton = false;
                  
                  if (rsvpConfig === 'detailed') {
                    if (guestStatus === 'accepted') {
                      shouldShowButton = true; // Always show for initial submit
                    } else if (guestStatus === 'submitted') {
                      shouldShowButton = Boolean(showEditButton); // Only show if edit is allowed
                    }
                  }
                  
                  // ADDITIONAL DEBUG: Show exactly what's happening
                  if (guestStatus === 'submitted') {
                    console.log('🚨 SUBMITTED STATUS DEBUG:', {
                      showEditButton,
                      showEditButtonBoolean: Boolean(showEditButton),
                      shouldShowButton,
                      willShowButton: shouldShowButton
                    });
                  }
                  
                  console.log('🔘 RSVP Button Visibility Check:', {
                    rsvpConfig,
                    guestStatus,
                    showEditButton,
                    shouldShowButton,
                    reason: guestStatus === 'accepted' ? 'Initial submit - always show' : 
                           guestStatus === 'submitted' && Boolean(showEditButton) ? 'Edit allowed - show button' : 
                           'Edit not allowed - hide button'
                  });
                  return shouldShowButton;
                })() && (
                  <div className="flex justify-center mb-4 sm:mb-6 px-4">
                    <Button
                      onClick={() => {
                        console.log('🔘 Submit RSVP Details button clicked - opening modal');
                        setShowConfetti(true);
                        setShowDetailedForm(true);
                      }}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold hover:from-amber-300 hover:via-yellow-200 hover:to-amber-300 text-white font-bold px-4 sm:px-6 md:px-10 py-3 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_35px_rgba(234,179,8,0.6)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-2 border-amber-300/50 hover:border-yellow-200/70 min-h-[48px] sm:min-h-[56px] group relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {getButtonText()}
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 mr-2 group-hover:animate-pulse" />
                          {getButtonText()}
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 opacity-70" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                <div className="pt-4 sm:pt-5 border-t border-wedding-gold/20 mx-4">
                  <p className="font-great-vibes text-base sm:text-lg md:text-2xl text-wedding-gold italic leading-relaxed">
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
                  <RSVPFieldRenderer
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
                <div className="text-center py-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">RSVP field types missing from payload; using text fallback.</p>
                  <p className="text-gray-600 text-sm mt-1">Please contact support if this message persists.</p>
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
                  className="flex-1 bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold hover:from-amber-300 hover:via-yellow-200 hover:to-amber-300 text-white rounded-lg py-2.5 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(234,179,8,0.5)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-0.5 border border-amber-300/50 hover:border-yellow-200/70 disabled:opacity-50 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
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
      // Open the detailed form immediately after acceptance
      setShowDetailedForm(true);
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
      
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-8 relative z-10">
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl border-2 border-wedding-gold/20 text-center relative overflow-hidden">
          {/* Mobile-optimized corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 md:w-16 sm:h-16 md:h-16 border-l-2 sm:border-l-3 border-t-2 sm:border-t-3 border-wedding-gold/30 rounded-tl-2xl sm:rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 md:w-16 sm:h-16 md:h-16 border-r-2 sm:border-r-3 border-t-2 sm:border-t-3 border-wedding-gold/30 rounded-tr-2xl sm:rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 md:w-16 sm:h-16 md:h-16 border-l-2 sm:border-l-3 border-b-2 sm:border-b-3 border-wedding-gold/30 rounded-bl-2xl sm:rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 md:w-16 sm:h-16 md:h-16 border-r-2 sm:border-r-3 border-b-2 sm:border-b-3 border-wedding-gold/30 rounded-br-2xl sm:rounded-br-3xl"></div>
          
          <div className="relative z-10">
            <div className="mb-4 sm:mb-5 md:mb-6 px-2">
              <div className="flex justify-center items-center mb-3 sm:mb-3 md:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 md:w-7 sm:h-5 md:h-7 text-wedding-gold animate-pulse mr-2 sm:mr-3" />
                <Heart className="w-6 h-6 sm:w-8 md:w-12 sm:h-8 md:h-12 text-wedding-gold animate-pulse" />
                <Sparkles className="w-4 h-4 sm:w-5 md:w-7 sm:h-5 md:h-7 text-wedding-gold animate-pulse ml-2 sm:ml-3" />
              </div>
              
              <h2 className="font-great-vibes text-xl sm:text-2xl md:text-4xl lg:text-5xl text-wedding-maroon mb-2 sm:mb-3 md:mb-4 leading-tight">
                Your Presence is Our Present
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-wedding-gold font-medium mb-4 sm:mb-5 md:mb-6 max-w-3xl mx-auto leading-relaxed">
                Please confirm your attendance to make our day complete
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
              {rsvpConfig === 'simple' ? (
                <Button
                  onClick={() => {
                    setShowConfetti(true);
                    handleSimpleAccept();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold hover:from-amber-300 hover:via-yellow-200 hover:to-amber-300 text-white font-bold px-4 sm:px-6 md:px-10 py-3 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_35px_rgba(234,179,8,0.6)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-2 border-amber-300/50 hover:border-yellow-200/70 min-h-[48px] sm:min-h-[56px] group disabled:opacity-50 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 mr-2 group-hover:animate-pulse" />
                      Accept Invitation
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 opacity-70" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowConfetti(true);
                    handleDetailedAccept();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-wedding-gold via-amber-300 to-wedding-gold hover:from-amber-300 hover:via-yellow-200 hover:to-amber-300 text-white font-bold px-4 sm:px-6 md:px-10 py-3 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_35px_rgba(234,179,8,0.6)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 border-2 border-amber-300/50 hover:border-yellow-200/70 min-h-[48px] sm:min-h-[56px] group disabled:opacity-50 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 sm:w-5 md:w-6 sm:h-5 md:h-6 mr-2 group-hover:animate-pulse" />
                      Accept Invitation
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-2 opacity-70" />
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