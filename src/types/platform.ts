export interface StructuredEventData {
  eventId: string;
  eventName: string;
  guestId: string;
  guestName: string;
  hasResponded: boolean;
  accepted: boolean;
  weddingData: {
    couple: {
      groomName: string;
      brideName: string;
      groomCity: string;
      brideCity: string;
      weddingDate: string;
      weddingTime: string;
      groomFirst: boolean;
      coupleImage: string;
    };
    venue: {
      name: string;
      address: string;
      mapLink: string;
    };
    family: {
      bride_family: {
        family_photo: string;
        parents_name: string;
        members: Array<{
          name: string;
          relation?: string;
          description?: string;
          photo?: string;
        }>;
      };
      groom_family: {
        family_photo: string;
        parents_name: string;
        members: Array<{
          name: string;
          relation?: string;
          description?: string;
          photo?: string;
        }>;
      };
    };
    contacts: Array<{
      name: string;
      phone: string;
      relation?: string;
    }>;
    gallery: Array<{
      photo: string;
      title?: string;
    }>;
    events: Array<{
      name: string;
      date: string;
      time: string;
      venue: string;
      description?: string;
      map_link?: string;
    }>;
  };
}

export interface CustomField {
  id?: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'select' | 'email' | 'number' | 'radio' | 'checkbox';
  is_required?: boolean;
  field_options?: {
    options?: Array<{label: string, value: string}>
  } | string[];
  placeholder_text?: string;
  display_order?: number;
  max_length?: number;
  validation_rules?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface PlatformData {
  // Core identifiers
  eventId?: string;
  guestId?: string;
  guestName?: string;
  eventName?: string;
  
  // Legacy compatibility
  hasResponded?: boolean;
  accepted?: boolean;
  guestViewed?: boolean;
  guestAccepted?: boolean;
  
  // Enhanced RSVP status (NEW - CRITICAL FOR BUTTONS)
  guestStatus?: 'pending' | 'viewed' | 'accepted' | 'submitted';
  viewed?: boolean;
  custom_fields_submitted?: boolean;
  
  // RSVP configuration
  rsvpConfig?: 'simple' | 'detailed' | {
    type: 'simple' | 'detailed';
    allowEditAfterSubmit?: boolean;
    customFields?: CustomField[];
    fields?: CustomField[];
  };
  hasCustomFields?: boolean;
  allowEditAfterSubmit?: boolean;
  
  // UI control flags - CRITICAL FOR BUTTON STATE
  canSubmitRsvp?: boolean;    // Can show Accept or Submit buttons
  canEditRsvp?: boolean;      // Can edit existing RSVP
  showSubmitButton?: boolean; // Show "Submit RSVP Details" button
  showEditButton?: boolean;   // Show "Edit RSVP Details" button
  
  // RSVP data
  rsvpData?: any;            // Existing RSVP form data
  existingRsvpData?: Record<string, any>; // Same as rsvpData (backward compatibility)
  
  // Custom fields for forms
  customFields?: CustomField[];
  
  // Timestamps
  viewed_at?: string | null;
  accepted_at?: string | null;
  custom_fields_submitted_at?: string | null;
  
  // Legacy data
  structuredData?: StructuredEventData;
}