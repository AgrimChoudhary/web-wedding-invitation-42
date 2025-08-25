import { useEffect, useState } from 'react';
import { PlatformData, StructuredEventData } from '../types/platform';

export const useUrlParams = () => {
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse RSVP configuration with enhanced debugging
  const parseRsvpConfig = (rsvpConfigParam: string | null): 'simple' | 'detailed' => {
    console.log('=== RSVP CONFIG PARSING DEBUG ===');
    console.log('Raw rsvpConfig parameter:', rsvpConfigParam);
    
    if (!rsvpConfigParam) {
      console.log('No rsvpConfig parameter found, defaulting to simple');
      return 'simple'; // Default to simple as per platform
    }
    
    try {
      // Handle URL encoded parameters
      const decoded = decodeURIComponent(rsvpConfigParam);
      console.log('Decoded rsvpConfig:', decoded);
      
      const config = JSON.parse(decoded);
      console.log('Parsed rsvpConfig object:', config);
      
      // Handle both {"type":"simple"} and direct "simple" formats
      const rsvpType = (config.type || config) === 'simple' ? 'simple' : 'detailed';
      console.log('Final RSVP type:', rsvpType);
      console.log('=== END RSVP CONFIG DEBUG ===');
      
      return rsvpType;
    } catch (error) {
      console.warn('Failed to parse rsvpConfig parameter:', error);
      console.log('=== END RSVP CONFIG DEBUG ===');
      return 'simple';
    }
  };

  useEffect(() => {
    try {
      console.log('=== URL PARAMETERS DEBUG ===');
      console.log('Current URL:', window.location.href);
      console.log('URL Search Params:', window.location.search);
      
      const urlParams = new URLSearchParams(window.location.search);
      
      // Log all URL parameters for debugging
      console.log('All URL Parameters:');
      for (let [key, value] of urlParams) {
        console.log(`${key}: ${value}`);
      }
      
      // Special logging for family parameters
      console.log('=== FAMILY PARAMETERS DEBUG ===');
      console.log('bride_family:', urlParams.get('bride_family'));
      console.log('groom_family:', urlParams.get('groom_family'));
      console.log('brideFamily:', urlParams.get('brideFamily'));
      console.log('groomFamily:', urlParams.get('groomFamily'));
      console.log('brideFamilyPhoto:', urlParams.get('brideFamilyPhoto'));
      console.log('bride_family_photo:', urlParams.get('bride_family_photo'));
      console.log('brideParentsNames:', urlParams.get('brideParentsNames'));
      console.log('bride_parents_name:', urlParams.get('bride_parents_name'));
      console.log('groomFamilyPhoto:', urlParams.get('groomFamilyPhoto'));
      console.log('groom_family_photo:', urlParams.get('groom_family_photo'));
      console.log('groomParentsNames:', urlParams.get('groomParentsNames'));
      console.log('groom_parents_name:', urlParams.get('groom_parents_name'));
      console.log('=== END FAMILY PARAMETERS DEBUG ===');
      
      // Try to parse the main data parameter first (recommended method)
      const dataParam = urlParams.get('data');
      if (dataParam) {
        try {
          const decodedData = decodeURIComponent(dataParam);
          const parsedData: StructuredEventData = JSON.parse(decodedData);
          
          setPlatformData({
            eventId: parsedData.eventId,
            guestId: parsedData.guestId,
            guestName: parsedData.guestName,
            // Allow status from structured data
            hasResponded: parsedData.hasResponded || false,
            accepted: parsedData.accepted || false,
            guestStatus: parsedData.accepted ? 'accepted' : 'invited',
            existingRsvpData: tryParseJSON(urlParams.get('existingRsvpData')),
            rsvpConfig: parseRsvpConfig(urlParams.get('rsvpConfig')),
            customFields: tryParseJSON(urlParams.get('customFields')) || [],
            structuredData: parsedData
          });
          
          console.log('✅ Structured Data - Allowing status from data:', {
            original: { hasResponded: parsedData.hasResponded, accepted: parsedData.accepted },
            final: { hasResponded: parsedData.hasResponded || false, accepted: parsedData.accepted || false, guestStatus: parsedData.accepted ? 'accepted' : 'invited' }
          });
          
          setIsLoading(false);
          return;
        } catch (jsonError) {
          console.warn('Failed to parse main data parameter, falling back to individual parameters');
        }
      }

      // Fallback to individual parameters (legacy support)
      const individualData: PlatformData = {
        eventId: urlParams.get('eventId') || undefined,
        guestId: urlParams.get('guestId') || undefined,
        guestName: urlParams.get('guestName') || undefined,
        // Allow URL status parameters to work
        hasResponded: urlParams.get('hasResponded') === 'true',
        accepted: urlParams.get('accepted') === 'true',
        guestStatus: (() => {
          const status = urlParams.get('guestStatus');
          // Map platform status values to template status values
          if (status === 'pending' || status === 'viewed') return 'invited';
          if (status === 'accepted' || status === 'submitted') return status;
          return 'invited';
        })() as 'invited' | 'accepted' | 'submitted',
        existingRsvpData: tryParseJSON(urlParams.get('existingRsvpData')),
        rsvpConfig: parseRsvpConfig(urlParams.get('rsvpConfig')),
        customFields: tryParseJSON(urlParams.get('customFields')) || []
      };

      console.log('✅ URL Parameters - Allowing status from URL:', {
        urlHasResponded: urlParams.get('hasResponded'),
        urlAccepted: urlParams.get('accepted'),
        urlGuestStatus: urlParams.get('guestStatus'),
        finalHasResponded: individualData.hasResponded,
        finalAccepted: individualData.accepted,
        finalGuestStatus: individualData.guestStatus
      });

      // Try to construct structured data from individual parameters
      const groomName = urlParams.get('groomName');
      const brideName = urlParams.get('brideName');
      
      if (groomName && brideName) {
        const structuredData: Partial<StructuredEventData> = {
          eventId: individualData.eventId || '',
          guestId: individualData.guestId || '',
          guestName: individualData.guestName || '',
          // Prevent automatic acceptance from individual parameters
          hasResponded: false, // Always start as false
          accepted: false, // Always start as false
          weddingData: {
            couple: {
              groomName,
              brideName,
              groomCity: urlParams.get('groomCity') || '',
              brideCity: urlParams.get('brideCity') || '',
              weddingDate: urlParams.get('weddingDate') || '',
              weddingTime: urlParams.get('weddingTime') || '',
              groomFirst: urlParams.get('groomFirst') === 'true',
              coupleImage: urlParams.get('couplePhoto') || urlParams.get('coupleImage') || ''
            },
            venue: {
              name: urlParams.get('venueName') || '',
              address: urlParams.get('venueAddress') || '',
              mapLink: urlParams.get('venueMapLink') || urlParams.get('mapLink') || ''
            },
            family: {
              bride_family: (() => {
                // Try to parse the full bride_family JSON structure first
                const brideFamilyData = tryParseJSON(urlParams.get('bride_family'));
                console.debug('🔍 FAMILY DATA DEBUG - Bride Family Raw:', urlParams.get('bride_family'));
                console.debug('🔍 FAMILY DATA DEBUG - Bride Family Parsed:', brideFamilyData);
                
                if (brideFamilyData) {
                  console.debug('✅ Using structured bride_family data');
                  return brideFamilyData;
                }
                
                // Support platform's camelCase brideFamily param
                const brideFamilyCamel = tryParseJSON(urlParams.get('brideFamily'));
                console.debug('🔍 FAMILY DATA DEBUG - Bride Family Camel:', brideFamilyCamel);
                
                if (brideFamilyCamel) {
                  console.debug('✅ Using camelCase brideFamily data');
                  return {
                    family_photo: brideFamilyCamel.familyPhoto || '',
                    parents_name: brideFamilyCamel.parentsNames || '',
                    members: Array.isArray(brideFamilyCamel.members) ? brideFamilyCamel.members.map((m: any) => ({
                      name: m.name || '',
                      relation: m.relation || '',
                      description: m.description || '',
                      photo: m.photo || ''
                    })) : []
                  };
                }
                
                // Fallback to individual parameters
                const fallbackBrideFamily = {
                  family_photo: urlParams.get('brideFamilyPhoto') || urlParams.get('bride_family_photo') || '',
                  parents_name: urlParams.get('brideParentsNames') || urlParams.get('bride_parents_name') || '',
                  members: tryParseJSON(urlParams.get('bride_family_members')) || []
                };
                console.debug('⚠️ Using fallback bride family parameters:', fallbackBrideFamily);
                return fallbackBrideFamily;
              })(),
              groom_family: (() => {
                // Try to parse the full groom_family JSON structure first
                const groomFamilyData = tryParseJSON(urlParams.get('groom_family'));
                console.debug('🔍 FAMILY DATA DEBUG - Groom Family Raw:', urlParams.get('groom_family'));
                console.debug('🔍 FAMILY DATA DEBUG - Groom Family Parsed:', groomFamilyData);
                
                if (groomFamilyData) {
                  console.debug('✅ Using structured groom_family data');
                  return groomFamilyData;
                }
                
                // Support platform's camelCase groomFamily param
                const groomFamilyCamel = tryParseJSON(urlParams.get('groomFamily'));
                console.debug('🔍 FAMILY DATA DEBUG - Groom Family Camel:', groomFamilyCamel);
                
                if (groomFamilyCamel) {
                  console.debug('✅ Using camelCase groomFamily data');
                  return {
                    family_photo: groomFamilyCamel.familyPhoto || '',
                    parents_name: groomFamilyCamel.parentsNames || '',
                    members: Array.isArray(groomFamilyCamel.members) ? groomFamilyCamel.members.map((m: any) => ({
                      name: m.name || '',
                      relation: m.relation || '',
                      description: m.description || '',
                      photo: m.photo || ''
                    })) : []
                  };
                }
                
                // Fallback to individual parameters
                const fallbackGroomFamily = {
                  family_photo: urlParams.get('groomFamilyPhoto') || urlParams.get('groom_family_photo') || '',
                  parents_name: urlParams.get('groomParentsNames') || urlParams.get('groom_parents_name') || '',
                  members: tryParseJSON(urlParams.get('groom_family_members')) || []
                };
                console.debug('⚠️ Using fallback groom family parameters:', fallbackGroomFamily);
                return fallbackGroomFamily;
              })()
            },
            contacts: tryParseJSON(urlParams.get('contacts')) || [],
            gallery: tryParseJSON(urlParams.get('photos')) || [],
            events: tryParseJSON(urlParams.get('events')) || []
          }
        };

        individualData.structuredData = structuredData as StructuredEventData;
      }

      setPlatformData(individualData);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Error parsing URL parameters:', err);
      setError('Failed to parse URL parameters');
      setIsLoading(false);
    }
  }, []);

  return { platformData, isLoading, error };
};

// Helper function to safely parse JSON strings
const tryParseJSON = (jsonString: string | null): any => {
  if (!jsonString) return null;
  
  try {
    return JSON.parse(decodeURIComponent(jsonString));
  } catch (e) {
    console.warn('Failed to parse JSON:', jsonString);
    return null;
  }
};