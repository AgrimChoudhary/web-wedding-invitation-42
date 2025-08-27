import { StructuredEventData } from '../types/platform';
import { WeddingData } from '../types/wedding';

export const mapPlatformDataToWeddingData = (platformData: StructuredEventData): WeddingData => {
  const { weddingData } = platformData;
  
  // Production mode - minimal logging
  
  // Process family data from multiple possible sources as per GitHub spec
  let groomFamily = null;
  let brideFamily = null;

  // Check for family data in multiple locations (URL params vs postMessage)
  const groomFamilySource = 
    (platformData as any).groom_family || 
    (platformData as any).groomFamily || 
    weddingData.family?.groom_family;
    
  const brideFamilySource = 
    (platformData as any).bride_family || 
    (platformData as any).brideFamily || 
    weddingData.family?.bride_family;

  if (groomFamilySource) {
    groomFamily = {
      title: groomFamilySource.title || "Groom's Family",
      members: (groomFamilySource.members || []).map((member: any, index: number) => ({
        id: member.id || `groom-member-${index}`,
        name: member.name || 'Unknown',
        relation: member.relation || 'Family Member',
        description: member.description || '',
        image: member.photo || member.image || '',
        showInDialogOnly: false
      })),
      familyPhotoUrl: groomFamilySource.familyPhoto || groomFamilySource.family_photo || groomFamilySource.photo || '',
      parentsNameCombined: groomFamilySource.parentsNames || groomFamilySource.parents_name || groomFamilySource.parents_names || groomFamilySource.parentsNameCombined || ''
    };
  }

  if (brideFamilySource) {
    brideFamily = {
      title: brideFamilySource.title || "Bride's Family",
      members: (brideFamilySource.members || []).map((member: any, index: number) => ({
        id: member.id || `bride-member-${index}`,
        name: member.name || 'Unknown',
        relation: member.relation || 'Family Member',
        description: member.description || '',
        image: member.photo || member.image || '',
        showInDialogOnly: false
      })),
      familyPhotoUrl: brideFamilySource.familyPhoto || brideFamilySource.family_photo || brideFamilySource.photo || '',
      parentsNameCombined: brideFamilySource.parentsNames || brideFamilySource.parents_name || brideFamilySource.parents_names || brideFamilySource.parentsNameCombined || ''
    };
  }

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
      groomFamily: groomFamily || {
        title: "Groom's Family",
        members: [],
        familyPhotoUrl: '',
        parentsNameCombined: ''
      },
      brideFamily: brideFamily || {
        title: "Bride's Family",
        members: [],
        familyPhotoUrl: '',
        parentsNameCombined: ''
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