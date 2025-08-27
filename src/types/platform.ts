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
  field_type: 'text' | 'textarea' | 'select' | 'email' | 'number' | 'phone' | 'radio' | 'checkbox' | 'date' | 'time' | 'datetime-local' | 'tel';
  is_required?: boolean;
  field_options?: string[] | { options: string[] };
  placeholder_text?: string;
  display_order?: number;
  max_length?: number;
  validation_rules?: Record<string, any>;
}

export interface PlatformData {
  eventId?: string;
  guestId?: string;
  guestName?: string;
  hasResponded?: boolean;
  accepted?: boolean;
  guestStatus?: 'invited' | 'accepted' | 'submitted';
  existingRsvpData?: Record<string, any>;
  rsvpConfig?: 'simple' | 'detailed';
  structuredData?: StructuredEventData;
  customFields?: CustomField[];
  wishesEnabled?: boolean;
}