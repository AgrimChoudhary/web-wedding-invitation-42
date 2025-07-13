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
      bride: {
        familyPhoto: string;
        parentsNames: string;
        members: Array<{
          name: string;
          relation?: string;
          description?: string;
          photo?: string;
        }>;
      };
      groom: {
        familyPhoto: string;
        parentsNames: string;
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

export interface PlatformData {
  eventId?: string;
  guestId?: string;
  guestName?: string;
  hasResponded?: boolean;
  accepted?: boolean;
  rsvpConfig?: 'simple' | 'detailed';
  structuredData?: StructuredEventData;
}