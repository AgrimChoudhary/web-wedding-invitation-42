export interface BaseMessage {
  type: string;
  timestamp: number;
}

// Platform to Template Messages
export interface InvitationLoadedMessage extends BaseMessage {
  type: 'INVITATION_LOADED';
  payload: {
    eventId: string;
    guestId: string;
    status: null | "accepted" | "submitted";
    showSubmitButton: boolean;
    showEditButton: boolean;
    eventDetails: {
      groom_name: string;
      bride_name: string;
      wedding_date: string;
      wedding_time: string;
      venue_name: string;
      venue_address: string;
      events: Array<{
        event_name: string;
        event_date: string;
        event_time: string;
        venue_name: string;
        venue_address: string;
      }>;
      photos: Array<{
        url: string;
        caption?: string;
      }>;
    };
    rsvpFields: Array<{
      id: string;
      field_name: string;
      field_label: string;
      field_type: 'text' | 'textarea' | 'select' | 'email' | 'number' | 'phone' | 'radio' | 'checkbox';
      is_required: boolean;
      placeholder_text?: string;
      field_options?: { options: string[] };
      validation_rules?: Record<string, any>;
      display_order: number;
    }>;
    existingRsvpData: Record<string, any> | null;
    platformData: {
      guestName: string;
      actualStatus: string;
      hasCustomFields: boolean;
      allowEdit: boolean;
    };
  };
}

export interface InvitationPayloadUpdateMessage extends BaseMessage {
  type: 'INVITATION_PAYLOAD_UPDATE';
  data: {
    eventId: string;
    guestId: string;
    status: null | "accepted" | "submitted";
    showSubmitButton: boolean;
    showEditButton: boolean;
    rsvpFields: Array<any>;
    existingRsvpData: Record<string, any> | null;
  };
}

// Template to Platform Messages
export interface InvitationViewedMessage extends BaseMessage {
  type: 'INVITATION_VIEWED';
  data: {
    eventId: string;
    guestId: string;
  };
}

export interface RSVPAcceptedMessage extends BaseMessage {
  type: 'RSVP_ACCEPTED';
  data: {
    eventId: string;
    guestId: string;
  };
}

export interface RSVPSubmittedMessage extends BaseMessage {
  type: 'RSVP_SUBMITTED';
  data: {
    eventId: string;
    guestId: string;
    rsvpData: Record<string, any>;
  };
}

export interface RSVPUpdatedMessage extends BaseMessage {
  type: 'RSVP_UPDATED';
  data: {
    eventId: string;
    guestId: string;
    rsvpData: Record<string, any>;
  };
}

export interface TemplateReadyMessage extends BaseMessage {
  type: 'TEMPLATE_READY';
  data: {
    templateVersion: string;
  };
}

export type PlatformMessage = 
  | InvitationLoadedMessage
  | InvitationPayloadUpdateMessage;

export type TemplateMessage = 
  | InvitationViewedMessage
  | RSVPAcceptedMessage 
  | RSVPSubmittedMessage
  | RSVPUpdatedMessage
  | TemplateReadyMessage;