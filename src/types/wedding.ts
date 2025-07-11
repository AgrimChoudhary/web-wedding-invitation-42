export interface WeddingCouple {
  groomFirstName: string;
  groomLastName: string;
  brideFirstName: string;
  brideLastName: string;
  groomAbout?: string;
  brideAbout?: string;
  groomCity?: string;
  brideCity?: string;
  coupleStory?: string;
  couplePhotoUrl?: string;
  coupleImageUrl?: string; // New parameter for couple section image
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  description?: string;
  image?: string;
  showInDialogOnly?: boolean;
}

export interface WeddingFamily {
  groomFamily: {
    title: string;
    members: FamilyMember[];
    familyPhotoUrl?: string; // New parameter for groom family photo
    parentsNameCombined?: string; // New parameter for combined parent names
  };
  brideFamily: {
    title: string;
    members: FamilyMember[];
    familyPhotoUrl?: string; // New parameter for bride family photo
    parentsNameCombined?: string; // New parameter for combined parent names
  };
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapLink?: string;
  description?: string;
}

export interface PhotoGalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface WeddingVenue {
  name: string;
  address: string;
  mapLink?: string;
}

export interface WeddingData {
  couple: WeddingCouple;
  family: WeddingFamily;
  mainWedding: {
    date: Date;
    time: string;
    venue: WeddingVenue;
  };
  events: WeddingEvent[];
  photoGallery: PhotoGalleryItem[];
  contacts: ContactPerson[];
  customMessage?: string;
  groomFirst?: boolean; // Added for platform integration
}
