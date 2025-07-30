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

export interface LoadInvitationDataMessage extends BaseMessage {
  type: 'LOAD_INVITATION_DATA';
  data: {
    event: {
      rsvp_config?: { type: string };
      [key: string]: any;
    };
    guest: any;
    // V2 Platform flags
    canSubmitRSVP?: boolean;
    canEditRSVP?: boolean;
    rsvpClosed?: boolean;
    deadlineMessage?: string;
    guestStatus?: 'pending' | 'viewed' | 'accepted' | 'submitted';
    existingRsvpData?: Record<string, any>;
  };
}

export interface RSVPAcceptedMessage extends BaseMessage {
  type: 'RSVP_ACCEPTED';
  data: {
    guestId: string;
    eventId: string;
    accepted: true;
    rsvpData?: Record<string, any>;
  };
}

export interface RSVPDeclinedMessage extends BaseMessage {
  type: 'RSVP_DECLINED';
  data: {
    guestId: string;
    eventId: string;
  };
}

export interface RSVPUpdatedMessage extends BaseMessage {
  type: 'RSVP_UPDATED';
  data: {
    guestId: string;
    eventId: string;
    rsvpData: Record<string, any>;
    newStatus: 'submitted';
  };
}

export interface InvitationViewedMessage extends BaseMessage {
  type: 'INVITATION_VIEWED';
  data: {
    guestId: string;
    eventId: string;
    timestamp?: number;
    viewDuration?: number;
  };
}

export interface StatusUpdateMessage extends BaseMessage {
  type: 'STATUS_UPDATE';
  data: {
    newStatus: 'pending' | 'viewed' | 'accepted' | 'submitted';
    canSubmitRSVP: boolean;
    canEditRSVP: boolean;
    rsvpClosed?: boolean;
    deadlineMessage?: string;
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
  | LoadInvitationDataMessage
  | StatusUpdateMessage;

export type TemplateMessage = 
  | RSVPAcceptedMessage 
  | RSVPDeclinedMessage
  | RSVPUpdatedMessage
  | InvitationViewedMessage
  | TemplateReadyMessage;