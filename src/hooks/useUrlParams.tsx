import { useEffect, useState } from 'react';
import { PlatformData, StructuredEventData } from '../types/platform';

export const useUrlParams = () => {
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse RSVP configuration
  const parseRsvpConfig = (rsvpConfigParam: string | null): 'simple' | 'detailed' => {
    if (!rsvpConfigParam) return 'detailed'; // Default to detailed
    
    try {
      const config = JSON.parse(rsvpConfigParam);
      return config.type === 'simple' ? 'simple' : 'detailed';
    } catch (error) {
      console.warn('Failed to parse rsvpConfig parameter:', error);
      return 'detailed';
    }
  };

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
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
              coupleImage: urlParams.get('coupleImage') || ''
            },
            venue: {
              name: urlParams.get('venueName') || '',
              address: urlParams.get('venueAddress') || '',
              mapLink: urlParams.get('venueMapLink') || ''
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