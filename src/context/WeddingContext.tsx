import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WeddingData, WeddingCouple, FamilyMember, WeddingEvent, PhotoGalleryItem, ContactPerson } from '@/types/wedding';
import { defaultWeddingData } from '@/placeholders';

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
  const [weddingData, setWeddingData] = useState<WeddingData>(defaultWeddingData);

  const setAllWeddingData = (data: WeddingData) => {
    setWeddingData(data);
  };

  const updateCouple = (couple: Partial<WeddingCouple>) => {
    setWeddingData(prev => ({
      ...prev,
      couple: { ...prev.couple, ...couple }
    }));
  };

  const addFamilyMember = (type: 'groom' | 'bride', member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `${type}-${Date.now()}`
    };
    
    setWeddingData(prev => ({
      ...prev,
      family: {
        ...prev.family,
        [type === 'groom' ? 'groomFamily' : 'brideFamily']: {
          ...prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'],
          members: [...prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'].members, newMember]
        }
      }
    }));
  };

  const removeFamilyMember = (type: 'groom' | 'bride', memberId: string) => {
    setWeddingData(prev => ({
      ...prev,
      family: {
        ...prev.family,
        [type === 'groom' ? 'groomFamily' : 'brideFamily']: {
          ...prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'],
          members: prev.family[type === 'groom' ? 'groomFamily' : 'brideFamily'].members.filter(m => m.id !== memberId)
        }
      }
    }));
  };

  const addEvent = (event: Omit<WeddingEvent, 'id'>) => {
    const newEvent: WeddingEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    
    setWeddingData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };

  const removeEvent = (eventId: string) => {
    setWeddingData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));
  };

  const addPhoto = (photo: Omit<PhotoGalleryItem, 'id'>) => {
    const newPhoto: PhotoGalleryItem = {
      ...photo,
      id: `photo-${Date.now()}`
    };
    
    setWeddingData(prev => ({
      ...prev,
      photoGallery: [...prev.photoGallery, newPhoto]
    }));
  };

  const removePhoto = (photoId: string) => {
    setWeddingData(prev => ({
      ...prev,
      photoGallery: prev.photoGallery.filter(p => p.id !== photoId)
    }));
  };

  const addContact = (contact: Omit<ContactPerson, 'id'>) => {
    const newContact: ContactPerson = {
      ...contact,
      id: `contact-${Date.now()}`
    };
    
    setWeddingData(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };

  const removeContact = (contactId: string) => {
    setWeddingData(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== contactId)
    }));
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