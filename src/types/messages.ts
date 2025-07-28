export interface BaseMessage {
  type: string;
  timestamp: number;
  source: 'PLATFORM' | 'TEMPLATE';
}

export interface WeddingDataTransferMessage extends BaseMessage {
  type: 'WEDDING_DATA_TRANSFER';
  data: {
    eventId: string;
    weddingData: any;
  };
}

export interface InvitationLoadedMessage extends BaseMessage {
  type: 'INVITATION_LOADED';
  data: {
    // Core identifiers
    eventId: string;
    guestId: string;
    guestName: string;
    eventName?: string;
    eventData?: any;
    
    // Legacy compatibility
    hasResponded?: boolean;
    accepted?: boolean;
    guestViewed?: boolean;
    guestAccepted?: boolean;
    
    // Enhanced RSVP status
    guestStatus?: 'pending' | 'viewed' | 'accepted' | 'submitted';
    viewed?: boolean;
    custom_fields_submitted?: boolean;
    
    // RSVP configuration
    rsvpConfig?: any;
    hasCustomFields?: boolean;
    allowEditAfterSubmit?: boolean;
    
    // UI control flags
    canSubmitRsvp?: boolean;
    canEditRsvp?: boolean;
    showSubmitButton?: boolean;
    showEditButton?: boolean;
    
    // RSVP data
    rsvpData?: any;
    existingRsvpData?: any;
    
    // Custom fields
    customFields?: any[];
    
    // Timestamps
    viewed_at?: string | null;
    accepted_at?: string | null;
    custom_fields_submitted_at?: string | null;
  };
}

export interface LoadInvitationDataMessage extends BaseMessage {
  type: 'LOAD_INVITATION_DATA';
  data: {
    event: {
      rsvp_config?: { type: string };
      [key: string]: any;
    };
    guest: any;
  };
}

export interface RSVPAcceptedMessage extends BaseMessage {
  type: 'RSVP_ACCEPTED';
  data: {
    accepted: true;
    rsvpData: {
      attendees: number;
      dietary_requirements?: string;
      special_requests?: string;
    };
  };
}

export interface InvitationViewedMessage extends BaseMessage {
  type: 'INVITATION_VIEWED';
  data: {
    timestamp: number;
    viewDuration: number;
  };
}

export interface TemplateReadyMessage extends BaseMessage {
  type: 'TEMPLATE_READY';
  data: {
    templateVersion: string;
  };
}

export type PlatformMessage = 
  | WeddingDataTransferMessage 
  | InvitationLoadedMessage
  | LoadInvitationDataMessage;

export type TemplateMessage = 
  | RSVPAcceptedMessage 
  | InvitationViewedMessage
  | TemplateReadyMessage;