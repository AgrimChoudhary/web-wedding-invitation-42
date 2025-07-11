import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeddingData, WeddingCouple, FamilyMember, WeddingEvent, PhotoGalleryItem, ContactPerson } from '@/types/wedding';
import { defaultWeddingData } from '@/placeholders';
import { usePlatform } from './PlatformContext';

interface WeddingContextType {
  weddingData: WeddingData;
  setAllWeddingData: (data: WeddingData) => void;
  updateCouple: (couple: Partial<WeddingCouple>) => void;
  addFamilyMember: (type: 'groom' | 'bride', member: Omit<FamilyMember, 'id'>) => void;
  removeFamilyMember: (type: 'groom' | 'bride', memberId: string) => void;
  addEvent: (event: Omit<WeddingEvent, 'id'>) => void;
  removeEvent: (eventId: string) => void;
  addPhoto: (photo: Omit<PhotoGalleryItem, 'id'>) => void;
  removePhoto: (photoId: string) => void;
  addContact: (contact: Omit<ContactPerson, 'id'>) => void;
  removeContact: (contactId: string) => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staticWeddingData, setStaticWeddingData] = useState<WeddingData>(defaultWeddingData);
  const { weddingData: platformWeddingData, isPlatformMode } = usePlatform();
  
  // Use platform data if available, otherwise fall back to static data
  const weddingData = isPlatformMode && platformWeddingData ? platformWeddingData : staticWeddingData;

  const setAllWeddingData = (data: WeddingData) => {
    // Only update static data when not in platform mode
    if (!isPlatformMode) {
      setStaticWeddingData(data);
    } else {
      console.warn('Cannot update wedding data in platform mode - data is controlled by platform');
    }
  };

  const updateCouple = (couple: Partial<WeddingCouple>) => {
    if (!isPlatformMode) {
      setStaticWeddingData(prev => ({
        ...prev,
        couple: { ...prev.couple, ...couple }
      }));
    }
  };

  const addFamilyMember = (type: 'groom' | 'bride', member: Omit<FamilyMember, 'id'>) => {
    if (!isPlatformMode) {
      const newMember: FamilyMember = {
        ...member,
        id: `${type}-${Date.now()}`
      };
      
      setStaticWeddingData(prev => ({
        ...prev,
        family: {
          ...prev.family,
          [type === 'groom' ? 'groomFamily' : 'brideFamily']: {
            ...prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'],
            members: [...prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'].members, newMember]
          }
        }
      }));
    }
  };

  const removeFamilyMember = (type: 'groom' | 'bride', memberId: string) => {
    if (!isPlatformMode) {
      setStaticWeddingData(prev => ({
        ...prev,
        family: {
          ...prev.family,
          [type === 'groom' ? 'groomFamily' : 'brideFamily']: {
            ...prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'],
            members: prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'].members.filter(m => m.id !== memberId)
          }
        }
      }));
    }
  };

  const addEvent = (event: Omit<WeddingEvent, 'id'>) => {
    if (!isPlatformMode) {
      const newEvent: WeddingEvent = {
        ...event,
        id: `event-${Date.now()}`
      };
      
      setStaticWeddingData(prev => ({
        ...prev,
        events: [...prev.events, newEvent]
      }));
    }
  };

  const removeEvent = (eventId: string) => {
    if (!isPlatformMode) {
      setStaticWeddingData(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== eventId)
      }));
    }
  };

  const addPhoto = (photo: Omit<PhotoGalleryItem, 'id'>) => {
    if (!isPlatformMode) {
      const newPhoto: PhotoGalleryItem = {
        ...photo,
        id: `photo-${Date.now()}`
      };
      
      setStaticWeddingData(prev => ({
        ...prev,
        photoGallery: [...prev.photoGallery, newPhoto]
      }));
    }
  };

  const removePhoto = (photoId: string) => {
    if (!isPlatformMode) {
      setStaticWeddingData(prev => ({
        ...prev,
        photoGallery: prev.photoGallery.filter(p => p.id !== photoId)
      }));
    }
  };

  const addContact = (contact: Omit<ContactPerson, 'id'>) => {
    if (!isPlatformMode) {
      const newContact: ContactPerson = {
        ...contact,
        id: `contact-${Date.now()}`
      };
      
      setStaticWeddingData(prev => ({
        ...prev,
        contacts: [...prev.contacts, newContact]
      }));
    }
  };

  const removeContact = (contactId: string) => {
    if (!isPlatformMode) {
      setStaticWeddingData(prev => ({
        ...prev,
        contacts: prev.contacts.filter(c => c.id !== contactId)
      }));
    }
  };

  return (
    <WeddingContext.Provider value={{
      weddingData,
      setAllWeddingData,
      updateCouple,
      addFamilyMember,
      removeFamilyMember,
      addEvent,
      removeEvent,
      addPhoto,
      removePhoto,
      addContact,
      removeContact
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};