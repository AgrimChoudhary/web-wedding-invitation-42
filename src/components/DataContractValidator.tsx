import React, { useEffect } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { useWedding } from '@/context/WeddingContext';
import { toast } from '@/hooks/use-toast';

const DataContractValidator: React.FC = () => {
  const { platformData, weddingData, isPlatformMode } = usePlatform();
  const { weddingData: contextWeddingData } = useWedding();

  useEffect(() => {
    if (!isPlatformMode) return;

    const validateDataContract = () => {
      console.log('=== DATA CONTRACT VALIDATION ===');
      console.log('Platform Data:', platformData);
      console.log('Wedding Data:', weddingData || contextWeddingData);
      
      const data = weddingData || contextWeddingData;
      if (!data) {
        console.error('❌ No wedding data available');
        toast({
          title: "Data Contract Issue",
          description: "No wedding data available",
          variant: "destructive"
        });
        return;
      }

      const validationResults = {
        couple: {
          groomName: Boolean(data.couple?.groomFirstName && data.couple?.groomLastName),
          brideName: Boolean(data.couple?.brideFirstName && data.couple?.brideLastName),
          cities: Boolean(data.couple?.groomCity || data.couple?.brideCity),
          coupleImage: Boolean(data.couple?.coupleImageUrl)
        },
        venue: {
          name: Boolean(data.mainWedding?.venue?.name),
          address: Boolean(data.mainWedding?.venue?.address),
          date: Boolean(data.mainWedding?.date),
          time: Boolean(data.mainWedding?.time)
        },
        family: {
          brideFamily: {
            exists: Boolean(data.family?.brideFamily),
            hasPhoto: Boolean(data.family?.brideFamily?.familyPhotoUrl),
            hasParentsNames: Boolean(data.family?.brideFamily?.parentsNameCombined),
            memberCount: data.family?.brideFamily?.members?.length || 0
          },
          groomFamily: {
            exists: Boolean(data.family?.groomFamily),
            hasPhoto: Boolean(data.family?.groomFamily?.familyPhotoUrl),
            hasParentsNames: Boolean(data.family?.groomFamily?.parentsNameCombined),
            memberCount: data.family?.groomFamily?.members?.length || 0
          }
        },
        events: {
          count: data.events?.length || 0
        },
        photos: {
          count: data.photoGallery?.length || 0
        },
        contacts: {
          count: data.contacts?.length || 0
        }
      };

      console.log('Validation Results:', validationResults);

      // Log specific family photo URLs
      console.log('Family Photo URLs:');
      console.log('- Bride Family Photo:', data.family?.brideFamily?.familyPhotoUrl);
      console.log('- Groom Family Photo:', data.family?.groomFamily?.familyPhotoUrl);
      console.log('- Couple Image:', data.couple?.coupleImageUrl);

      const issues = [];
      
      if (!validationResults.couple.groomName) issues.push('Missing groom name');
      if (!validationResults.couple.brideName) issues.push('Missing bride name');
      if (!validationResults.venue.name) issues.push('Missing venue name');
      if (!validationResults.venue.date) issues.push('Missing wedding date');
      
      if (issues.length > 0) {
        console.warn('⚠️ Data Contract Issues:', issues);
        toast({
          title: "Data Contract Issues Found",
          description: issues.join(', '),
          variant: "destructive"
        });
      } else {
        console.log('✅ Data contract validation passed');
        toast({
          title: "Data Contract Validated",
          description: `All required fields present. Bride: ${validationResults.family.brideFamily.memberCount} members, Groom: ${validationResults.family.groomFamily.memberCount} members`,
          variant: "default"
        });
      }

      console.log('=== END DATA CONTRACT VALIDATION ===');
    };

    // Validate after a short delay to ensure all data is loaded
    const timeoutId = setTimeout(validateDataContract, 1000);
    return () => clearTimeout(timeoutId);
  }, [platformData, weddingData, contextWeddingData, isPlatformMode]);

  // Simulate a test payload for development
  const simulateTestPayload = () => {
    const testPayload = {
      type: 'INVITATION_LOADED',
      payload: {
        eventId: 'test-event-id',
        guestId: 'test-guest-id',
        name: 'Test Wedding',
        status: 'pending',
        showSubmitButton: true,
        showEditButton: false,
        rsvpFields: [],
        existingRsvpData: null,
        wishesEnabled: true,
        platformData: {
          guestName: 'Test Guest'
        },
        eventDetails: {
          groom_name: 'Test Groom',
          bride_name: 'Test Bride',
          groom_city: 'Test City 1',
          bride_city: 'Test City 2',
          wedding_date: '2025-08-24',
          wedding_time: '14:05',
          venue_name: 'Test Venue',
          venue_address: 'Test Address',
          venue_map_link: 'https://maps.google.com',
          groom_first: true,
          couple_image: 'https://via.placeholder.com/600x400',
          bride_family_photo: 'https://via.placeholder.com/300x300',
          groom_family_photo: 'https://via.placeholder.com/300x300',
          bride_parents_names: 'Test Bride Parents',
          groom_parents_names: 'Test Groom Parents',
          bride_family: {
            members: [
              {
                name: 'Test Bride Member',
                photo: 'https://via.placeholder.com/150x150',
                relation: 'Sister',
                description: 'Test description'
              }
            ]
          },
          groom_family: {
            members: [
              {
                name: 'Test Groom Member',
                photo: 'https://via.placeholder.com/150x150',
                relation: 'Brother',
                description: 'Test description'
              }
            ]
          },
          events: [
            {
              name: 'Test Event',
              date: '2025-08-24',
              time: '12:00',
              venue: 'Test Event Venue',
              description: 'Test event description',
              map_link: 'https://maps.google.com'
            }
          ],
          photos: [
            {
              src: 'https://via.placeholder.com/400x300',
              title: 'Test Photo',
              alt: 'Test photo alt text',
              description: 'Test photo description'
            }
          ],
          contacts: [
            {
              name: 'Test Contact',
              phone: '9999999999',
              relation: 'Friend'
            }
          ]
        }
      }
    };

    // Post the test message to trigger data processing
    window.postMessage(testPayload, '*');
    
    toast({
      title: "Test Payload Sent",
      description: "Simulated a full INVITATION_LOADED event with test data",
      variant: "default"
    });
  };

  if (!isPlatformMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={simulateTestPayload}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition-colors"
        >
          Test Data Contract
        </button>
      </div>
    );
  }

  return null;
};

export default DataContractValidator;