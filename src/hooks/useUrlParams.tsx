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
            hasResponded: parsedData.hasResponded,
            accepted: parsedData.accepted,
            rsvpConfig: parseRsvpConfig(urlParams.get('rsvpConfig')),
            structuredData: parsedData
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
        hasResponded: urlParams.get('hasResponded') === 'true',
        accepted: urlParams.get('accepted') === 'true',
        rsvpConfig: parseRsvpConfig(urlParams.get('rsvpConfig'))
      };

      // Try to construct structured data from individual parameters
      const groomName = urlParams.get('groomName');
      const brideName = urlParams.get('brideName');
      
      if (groomName && brideName) {
        const structuredData: Partial<StructuredEventData> = {
          eventId: individualData.eventId || '',
          guestId: individualData.guestId || '',
          guestName: individualData.guestName || '',
          hasResponded: individualData.hasResponded || false,
          accepted: individualData.accepted || false,
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
              bride: {
                familyPhoto: urlParams.get('brideFamilyPhoto') || '',
                parentsNames: urlParams.get('brideParentsNames') || '',
                members: tryParseJSON(urlParams.get('brideFamily')) || []
              },
              groom: {
                familyPhoto: urlParams.get('groomFamilyPhoto') || '',
                parentsNames: urlParams.get('groomParentsNames') || '',
                members: tryParseJSON(urlParams.get('groomFamily')) || []
              }
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