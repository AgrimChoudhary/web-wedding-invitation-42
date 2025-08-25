import React, { useEffect } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { useWedding } from '@/context/WeddingContext';
import { toast } from 'sonner';

/**
 * Verification component that logs and validates received data from UTSAVY platform
 * Based on the authoritative data contract from UTSAVY GitHub
 */
const DataVerificationLogger: React.FC = () => {
  const { platformData, weddingData: platformWeddingData } = usePlatform();
  const { weddingData } = useWedding();

  useEffect(() => {
    console.log('🎯 DATA VERIFICATION LOGGER - Platform Data Contract Check');
    console.log('='.repeat(60));
    
    // Log URL parameter data if available
    if (platformData) {
      console.log('📊 PLATFORM DATA RECEIVED:');
      console.log('  Event ID:', platformData.eventId);
      console.log('  Guest ID:', platformData.guestId);
      console.log('  Guest Name:', platformData.guestName);
      console.log('  Guest Status:', platformData.guestStatus);
      console.log('  Has Responded:', platformData.hasResponded);
      console.log('  RSVP Config:', platformData.rsvpConfig);
      console.log('  Wishes Enabled:', platformData.wishesEnabled);
      console.log('  Custom Fields Count:', platformData.customFields?.length || 0);
      
      if (platformData.structuredData) {
        console.log('📋 STRUCTURED DATA BREAKDOWN:');
        const wd = platformData.structuredData.weddingData;
        
        // Couple Data Verification
        console.log('👫 COUPLE DATA:');
        console.log('  Groom:', wd?.couple?.groomName);
        console.log('  Bride:', wd?.couple?.brideName);
        console.log('  Wedding Date:', wd?.couple?.weddingDate);
        console.log('  Wedding Time:', wd?.couple?.weddingTime);
        console.log('  Venue:', wd?.venue?.name);
        console.log('  Address:', wd?.venue?.address);
        
        // Family Data Verification - CRITICAL for this template
        console.log('👨‍👩‍👧‍👦 FAMILY DATA VERIFICATION:');
        console.log('  Bride Family Object:', wd?.family?.bride_family);
        console.log('  Groom Family Object:', wd?.family?.groom_family);
        
        if (wd?.family?.bride_family) {
          console.log('  👰 BRIDE FAMILY DETAILS:');
          console.log('    Family Photo:', wd.family.bride_family.family_photo);
          console.log('    Parents Name:', wd.family.bride_family.parents_name);
          console.log('    Members Count:', wd.family.bride_family.members?.length || 0);
          if (wd.family.bride_family.members) {
            wd.family.bride_family.members.forEach((member, i) => {
              console.log(`    Member ${i + 1}:`, {
                name: member.name,
                relation: member.relation,
                photo: member.photo,
                description: member.description
              });
            });
          }
        }
        
        if (wd?.family?.groom_family) {
          console.log('  🤵 GROOM FAMILY DETAILS:');
          console.log('    Family Photo:', wd.family.groom_family.family_photo);
          console.log('    Parents Name:', wd.family.groom_family.parents_name);
          console.log('    Members Count:', wd.family.groom_family.members?.length || 0);
          if (wd.family.groom_family.members) {
            wd.family.groom_family.members.forEach((member, i) => {
              console.log(`    Member ${i + 1}:`, {
                name: member.name,
                relation: member.relation,
                photo: member.photo,
                description: member.description
              });
            });
          }
        }
        
        // Photo Gallery Verification
        console.log('📸 PHOTO GALLERY VERIFICATION:');
        console.log('  Photos Count:', wd?.gallery?.length || 0);
        if (wd?.gallery?.length > 0) {
          wd.gallery.forEach((photo, i) => {
            console.log(`  Photo ${i + 1}:`, {
              url: photo.photo,
              title: photo.title
            });
          });
        }
        
        // Events Verification
        console.log('📅 EVENTS VERIFICATION:');
        console.log('  Events Count:', wd?.events?.length || 0);
        if (wd?.events?.length > 0) {
          wd.events.forEach((event, i) => {
            console.log(`  Event ${i + 1}:`, {
              name: event.name,
              date: event.date,
              time: event.time,
              venue: event.venue,
              mapLink: event.map_link
            });
          });
        }
        
        // Contacts Verification
        console.log('📞 CONTACTS VERIFICATION:');
        console.log('  Contacts Count:', wd?.contacts?.length || 0);
        if (wd?.contacts?.length > 0) {
          wd.contacts.forEach((contact, i) => {
            console.log(`  Contact ${i + 1}:`, {
              name: contact.name,
              phone: contact.phone,
              relation: contact.relation
            });
          });
        }
      }
    }
    
    // Verify mapped wedding data
    if (platformWeddingData) {
      console.log('🎯 MAPPED WEDDING DATA VERIFICATION:');
      console.log('  Family Data Mapped:', !!platformWeddingData.family);
      console.log('  Bride Family Members:', platformWeddingData.family?.brideFamily?.members?.length || 0);
      console.log('  Groom Family Members:', platformWeddingData.family?.groomFamily?.members?.length || 0);
      console.log('  Photo Gallery Items:', platformWeddingData.photoGallery?.length || 0);
      console.log('  Events:', platformWeddingData.events?.length || 0);
      console.log('  Contacts:', platformWeddingData.contacts?.length || 0);
    }
    
    console.log('='.repeat(60));
    
    // Show verification toast
    const dataPresent = {
      familyData: !!(platformData?.structuredData?.weddingData?.family?.bride_family || platformData?.structuredData?.weddingData?.family?.groom_family),
      photos: !!(platformData?.structuredData?.weddingData?.gallery?.length > 0),
      events: !!(platformData?.structuredData?.weddingData?.events?.length > 0),
      contacts: !!(platformData?.structuredData?.weddingData?.contacts?.length > 0)
    };
    
    const presentCount = Object.values(dataPresent).filter(Boolean).length;
    
    if (presentCount > 0) {
      toast.success(`Data verification complete: ${presentCount}/4 sections loaded`, {
        description: `Family: ${dataPresent.familyData ? '✅' : '❌'} | Photos: ${dataPresent.photos ? '✅' : '❌'} | Events: ${dataPresent.events ? '✅' : '❌'} | Contacts: ${dataPresent.contacts ? '✅' : '❌'}`,
        duration: 5000
      });
    } else {
      toast.info('No platform data received - using template defaults', {
        description: 'Template will display placeholder content',
        duration: 3000
      });
    }
  }, [platformData, platformWeddingData, weddingData]);

  // Listen for postMessage events directly
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'INVITATION_LOADED') {
        console.log('🎯 INVITATION_LOADED MESSAGE VERIFICATION:');
        const payload = event.data.payload || event.data.data;
        
        if (payload?.eventDetails) {
          console.log('📊 EVENT DETAILS FROM POSTMESSAGE:');
          console.log('  Bride Name:', payload.eventDetails.bride_name);
          console.log('  Groom Name:', payload.eventDetails.groom_name);
          console.log('  Wedding Date:', payload.eventDetails.wedding_date);
          console.log('  Venue:', payload.eventDetails.venue_name);
          
          // CRITICAL: Verify family data structure from postMessage
          console.log('👨‍👩‍👧‍👦 FAMILY DATA FROM POSTMESSAGE:');
          console.log('  Bride Family:', payload.eventDetails.bride_family);
          console.log('  Groom Family:', payload.eventDetails.groom_family);
          
          // Verify other data arrays
          console.log('📸 Photos from postMessage:', payload.eventDetails.photos?.length || 0);
          console.log('📅 Events from postMessage:', payload.eventDetails.events?.length || 0);
          console.log('📞 Contacts from postMessage:', payload.eventDetails.contacts?.length || 0);
          
          toast.success('INVITATION_LOADED postMessage received', {
            description: 'Check console for detailed verification logs',
            duration: 4000
          });
        }
      } else if (event.data?.type === 'WEDDING_DATA_READY') {
        console.log('🎯 WEDDING_DATA_READY MESSAGE VERIFICATION:');
        const data = event.data.payload || event.data;
        console.log('  Event Details Object:', data.eventDetails);
        
        toast.success('WEDDING_DATA_READY postMessage received', {
          description: 'Additional wedding data loaded',
          duration: 3000
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return null; // This is a utility component - no UI
};

export default DataVerificationLogger;