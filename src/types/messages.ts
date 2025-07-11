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
    eventId: string;
    guestId: string;
    guestName: string;
    eventData: any;
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
  | InvitationLoadedMessage;

export type TemplateMessage = 
  | RSVPAcceptedMessage 
  | InvitationViewedMessage
  | TemplateReadyMessage;