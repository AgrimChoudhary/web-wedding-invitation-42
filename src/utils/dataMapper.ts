import { StructuredEventData } from '../types/platform';
import { WeddingData } from '../types/wedding';

export const mapPlatformDataToWeddingData = (platformData: StructuredEventData): WeddingData => {
  const { weddingData } = platformData;
  
  return {
    couple: {
      groomFirstName: extractFirstName(weddingData.couple.groomName),
      groomLastName: extractLastName(weddingData.couple.groomName),
      brideFirstName: extractFirstName(weddingData.couple.brideName),
      brideLastName: extractLastName(weddingData.couple.brideName),
      groomCity: weddingData.couple.groomCity,
      brideCity: weddingData.couple.brideCity,
      coupleImageUrl: weddingData.couple.coupleImage
    },
    family: {
      groomFamily: {
        title: "Groom's Family",
        members: weddingData.family.groom_family.members.map((member, index) => ({
          id: `groom-${index}`,
          name: member.name,
          relation: member.relation || '',
          description: member.description,
          image: member.photo
        })),
        familyPhotoUrl: weddingData.family.groom_family.family_photo,
        parentsNameCombined: weddingData.family.groom_family.parents_name
      },
      brideFamily: {
        title: "Bride's Family",
        members: weddingData.family.bride_family.members.map((member, index) => ({
          id: `bride-${index}`,
          name: member.name,
          relation: member.relation || '',
          description: member.description,
          image: member.photo
        })),
        familyPhotoUrl: weddingData.family.bride_family.family_photo,
        parentsNameCombined: weddingData.family.bride_family.parents_name
      }
    },
    mainWedding: {
      date: new Date(weddingData.couple.weddingDate),
      time: weddingData.couple.weddingTime,
      venue: {
        name: weddingData.venue.name,
        address: weddingData.venue.address,
        mapLink: weddingData.venue.mapLink
      }
    },
    events: weddingData.events.map((event, index) => ({
      id: `event-${index}`,
      name: event.name,
      date: event.date,
      time: event.time,
      venue: event.venue,
      address: '', // Platform doesn't provide separate address for events
      mapLink: event.map_link,
      description: event.description
    })),
    photoGallery: weddingData.gallery.map((photo, index) => ({
      id: `photo-${index}`,
      url: photo.photo,
      title: photo.title || `Photo ${index + 1}`,
      description: ''
    })),
    contacts: weddingData.contacts.map((contact, index) => ({
      id: `contact-${index}`,
      name: contact.name,
      relation: contact.relation || '',
      phone: contact.phone
    })),
    groomFirst: weddingData.couple.groomFirst
  };
};

// Helper functions to extract first and last names
const extractFirstName = (fullName: string): string => {
  const nameParts = fullName.trim().split(' ');
  return nameParts[0] || '';
};

const extractLastName = (fullName: string): string => {
  const nameParts = fullName.trim().split(' ');
  return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
};

// Validate platform data structure
export const validatePlatformData = (data: any): data is StructuredEventData => {
  try {
    return (
      data &&
      typeof data.eventId === 'string' &&
      data.weddingData &&
      data.weddingData.couple &&
      typeof data.weddingData.couple.groomName === 'string' &&
      typeof data.weddingData.couple.brideName === 'string'
    );
  } catch (error) {
    console.error('Invalid platform data structure:', error);
    return false;
  }
};