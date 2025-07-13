# Royal Indian Wedding Template - Platform Integration Report

## Executive Summary

This document provides a comprehensive technical specification for integrating the Royal Indian Wedding Template with external platforms via URL parameters and PostMessage API. The template supports dual integration modes: URL parameter-based data transmission and real-time PostMessage communication for dynamic interactions.

## Template Overview

**Template Name**: Royal Indian Wedding Template  
**Version**: 1.0  
**Framework**: React + TypeScript + Tailwind CSS  
**Integration Methods**: URL Parameters + PostMessage API  
**Data Format**: JSON-structured wedding information  

## Integration Architecture

### 1. URL Parameter Integration

The template accepts wedding data through two methods:

#### Method 1: Single JSON Parameter (Recommended)
```
https://template-url.com/?data={encoded_json_data}
```

#### Method 2: Individual Parameters (Legacy Support)
```
https://template-url.com/?groomName=John&brideName=Jane&eventId=123...
```

### 2. PostMessage API Integration

Real-time bidirectional communication between platform and template for:
- Dynamic data updates
- RSVP submissions
- Analytics tracking
- User interaction events

## Supported URL Parameters

### Core Parameters

| Parameter | Type | Required | Description | UI Impact |
|-----------|------|----------|-------------|-----------|
| `data` | JSON String | No | Complete wedding data in JSON format | Populates entire template |
| `eventId` | String | Yes | Unique event identifier | Used for analytics & RSVP tracking |
| `guestId` | String | No | Guest identifier | Personalizes experience |
| `guestName` | String | No | Guest display name | Shows personalized greeting |

### Individual Parameters (Legacy Support)

#### Couple Information
| Parameter | Type | Required | UI Component | Description |
|-----------|------|----------|--------------|-------------|
| `groomName` | String | Yes | Header, Couple Section | Groom's full name - auto-splits to first/last |
| `brideName` | String | Yes | Header, Couple Section | Bride's full name - auto-splits to first/last |
| `groomCity` | String | No | Couple Section | Groom's city display |
| `brideCity` | String | No | Couple Section | Bride's city display |
| `groomFirst` | Boolean | No | Header, Couple Section | Name display order (true = groom first) |
| `coupleImage` | URL | No | Couple Section | Main couple photo |

#### Wedding Details
| Parameter | Type | Required | UI Component | Description |
|-----------|------|----------|--------------|-------------|
| `weddingDate` | ISO Date | Yes | Header, Timeline | Main wedding ceremony date |
| `weddingTime` | String | Yes | Timeline | Wedding ceremony time |
| `venueName` | String | Yes | Timeline, Venue | Main venue name |
| `venueAddress` | String | Yes | Timeline, Venue | Complete venue address |
| `venueMapLink` | URL | No | Timeline, Venue | Google Maps link |

#### Family Information
| Parameter | Type | Required | UI Component | Description |
|-----------|------|----------|--------------|-------------|
| `brideFamilyPhoto` | URL | No | Family Section | Bride's family group photo |
| `brideParentsNames` | String | No | Family Section | Combined parent names display |
| `brideFamily` | JSON Array | No | Family Section | Bride family members array |
| `groomFamilyPhoto` | URL | No | Family Section | Groom's family group photo |
| `groomParentsNames` | String | No | Family Section | Combined parent names display |
| `groomFamily` | JSON Array | No | Family Section | Groom family members array |

#### Event Information
| Parameter | Type | Required | UI Component | Description |
|-----------|------|----------|--------------|-------------|
| `events` | JSON Array | No | Event Timeline | Multiple wedding events |

#### Gallery & Contacts
| Parameter | Type | Required | UI Component | Description |
|-----------|------|----------|--------------|-------------|
| `photos` | JSON Array | No | Photo Gallery | Wedding photo gallery |
| `contacts` | JSON Array | No | Contact Section | Emergency contacts |

## JSON Data Structure Specification

### Complete Data Structure
```typescript
{
  "eventId": "string",
  "eventName": "string", 
  "guestId": "string",
  "guestName": "string",
  "hasResponded": boolean,
  "accepted": boolean,
  "weddingData": {
    "couple": {
      "groomName": "string",        // Full name
      "brideName": "string",        // Full name  
      "groomCity": "string",
      "brideCity": "string",
      "weddingDate": "ISO_DATE",    // 2024-02-14
      "weddingTime": "string",      // "6:00 PM"
      "groomFirst": boolean,        // Name display order
      "coupleImage": "URL"          // Couple photo
    },
    "venue": {
      "name": "string",
      "address": "string", 
      "mapLink": "URL"              // Google Maps URL
    },
    "family": {
      "bride": {
        "familyPhoto": "URL",
        "parentsNames": "string",   // "Mr. & Mrs. Smith"
        "members": [
          {
            "name": "string",
            "relation": "string",     // "Sister", "Brother", etc.
            "description": "string",  // Optional description
            "photo": "URL"           // Optional member photo
          }
        ]
      },
      "groom": {
        "familyPhoto": "URL", 
        "parentsNames": "string",
        "members": [
          {
            "name": "string",
            "relation": "string",
            "description": "string",
            "photo": "URL"
          }
        ]
      }
    },
    "contacts": [
      {
        "name": "string",
        "phone": "string",           // "+1-234-567-8900"
        "relation": "string"         // "Uncle", "Coordinator", etc.
      }
    ],
    "gallery": [
      {
        "photo": "URL",
        "title": "string"           // Photo title/caption
      }
    ],
    "events": [
      {
        "name": "string",           // "Mehndi", "Sangam", etc.
        "date": "string",           // "2024-02-13"
        "time": "string",           // "4:00 PM"
        "venue": "string",
        "description": "string",
        "map_link": "URL"
      }
    ]
  }
}
```

## PostMessage API Specification

### Platform to Template Messages

#### 1. Wedding Data Transfer
```javascript
{
  type: 'WEDDING_DATA_TRANSFER',
  data: {
    eventId: 'ABC123',
    weddingData: { /* Complete wedding data structure */ }
  },
  timestamp: 1642505400000,
  source: 'PLATFORM'
}
```

#### 2. Invitation Loaded Confirmation
```javascript  
{
  type: 'INVITATION_LOADED',
  data: {
    eventId: 'ABC123',
    guestId: 'XYZ789', 
    guestName: 'John Doe',
    eventData: { /* Event details */ }
  },
  timestamp: 1642505400000,
  source: 'PLATFORM'
}
```

### Template to Platform Messages

#### 1. Template Ready Signal
```javascript
{
  type: 'TEMPLATE_READY',
  data: {
    templateVersion: '1.0'
  },
  timestamp: 1642505400000,
  source: 'TEMPLATE'
}
```

#### 2. RSVP Accepted
```javascript
{
  type: 'RSVP_ACCEPTED', 
  data: {
    accepted: true,
    rsvpData: {
      attendees: 2,
      dietary_requirements: 'Vegetarian',
      special_requests: 'Wheelchair access needed'
    }
  },
  timestamp: 1642505400000,
  source: 'TEMPLATE'
}
```

#### 3. Invitation Analytics
```javascript
{
  type: 'INVITATION_VIEWED',
  data: {
    timestamp: 1642505400000,
    viewDuration: 30000  // milliseconds
  },
  timestamp: 1642505400000,
  source: 'TEMPLATE'
}
```

## UI Component Mapping

### Header Section
- **Data Sources**: `groomName`, `brideName`, `groomFirst`, `weddingDate`
- **Displays**: Couple names (order based on groomFirst), wedding date
- **Animation**: Typing animation for names

### Couple Section  
- **Data Sources**: `groomName`, `brideName`, `groomCity`, `brideCity`, `coupleImage`
- **Displays**: Individual couple cards with cities and main photo
- **Animations**: Fade-in effects, hover interactions

### Family Section
- **Data Sources**: `family.bride.members[]`, `family.groom.members[]`, family photos, parent names
- **Displays**: Family member cards, family group photos, parent names
- **Interactions**: Click to view detailed family member information

### Event Timeline
- **Data Sources**: `mainWedding` (date, time, venue), `events[]` array
- **Displays**: Chronological event timeline with venues and times
- **Features**: Interactive timeline with map links

### Photo Gallery
- **Data Sources**: `gallery[]` array  
- **Displays**: Grid layout with lightbox functionality
- **Features**: Photo titles, responsive grid

### Contact Section
- **Data Sources**: `contacts[]` array
- **Displays**: Contact cards with names, relations, phone numbers
- **Features**: Click-to-call functionality

### RSVP Modal
- **Functionality**: Collects attendance, dietary requirements, special requests
- **Integration**: Sends data via PostMessage API
- **Note**: No decline option (as per platform requirements)

## Integration Flow

### 1. Initialization Sequence
```
1. Template loads → Sends TEMPLATE_READY message
2. Platform receives ready signal
3. Platform sends WEDDING_DATA_TRANSFER message
4. Template processes and displays data
5. Template sends INVITATION_LOADED confirmation
```

### 2. RSVP Flow
```
1. Guest clicks RSVP button
2. Modal opens with form
3. Guest fills details and submits
4. Template validates data
5. Template sends RSVP_ACCEPTED message
6. Platform processes RSVP
7. Template shows confirmation
```

### 3. Analytics Flow
```
1. Template tracks user interactions
2. Template measures view duration
3. Template sends INVITATION_VIEWED message
4. Platform logs analytics data
```

## Security Implementation

### Origin Validation
```javascript
const ALLOWED_ORIGINS = [
  'https://utsavy2.vercel.app',
  'https://platform-domain.com',
  window.location.origin
];
```

### Message Validation
- Message structure validation
- Timestamp verification
- Source authentication
- Data type checking

### URL Parameter Security
- URL encoding for special characters
- JSON parsing error handling
- Maximum length validation
- XSS prevention

## Error Handling

### URL Parameter Errors
- **Malformed JSON**: Falls back to individual parameters
- **Missing required data**: Uses placeholder content
- **Invalid dates**: Shows default date format
- **Broken image URLs**: Uses placeholder images

### PostMessage Errors
- **Origin mismatch**: Logs security warning and rejects
- **Invalid message structure**: Logs error and ignores
- **Timeout handling**: 5-second timeout for critical operations
- **Retry mechanism**: Automatic retry for failed transmissions

## Testing Scenarios

### URL Parameter Testing
```javascript
// Test with complete JSON data
const completeUrl = 'https://template.com/?data=' + 
  encodeURIComponent(JSON.stringify(completeWeddingData));

// Test with individual parameters
const individualUrl = 'https://template.com/?' + 
  'groomName=John+Doe&brideName=Jane+Smith&weddingDate=2024-02-14';

// Test with minimal data
const minimalUrl = 'https://template.com/?eventId=123&groomName=John&brideName=Jane';
```

### PostMessage Testing
```javascript
// Test platform to template communication
window.postMessage({
  type: 'WEDDING_DATA_TRANSFER',
  data: testWeddingData,
  timestamp: Date.now(),
  source: 'PLATFORM'
}, '*');

// Test template to platform communication  
const testRSVP = {
  type: 'RSVP_ACCEPTED',
  data: { accepted: true, rsvpData: { attendees: 2 } },
  timestamp: Date.now(),
  source: 'TEMPLATE'
};
```

## Performance Considerations

### Data Size Limits
- **Maximum URL length**: 8KB (browser dependent)
- **Recommended JSON size**: <5KB for optimal performance
- **Image optimization**: Recommend compressed images <500KB

### Loading Performance
- **Initial render**: <2 seconds with full data
- **PostMessage latency**: <100ms typical
- **Image loading**: Progressive loading with placeholders

## Browser Compatibility

### Supported Browsers
- Chrome 70+
- Firefox 65+  
- Safari 12+
- Edge 79+

### PostMessage Support
- Full support in all modern browsers
- Fallback to URL parameters for legacy browsers

## Integration Examples

### Platform Implementation Example
```javascript
// Embed template with URL parameters
const weddingData = {
  eventId: 'WEDDING_123',
  guestId: 'GUEST_456', 
  weddingData: { /* complete data */ }
};

const templateUrl = `https://template.com/?data=${encodeURIComponent(JSON.stringify(weddingData))}`;

// Create iframe
const iframe = document.createElement('iframe');
iframe.src = templateUrl;
iframe.width = '100%';
iframe.height = '100vh';

// Listen for template messages
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://template.com') return;
  
  const { type, data } = event.data;
  switch (type) {
    case 'TEMPLATE_READY':
      console.log('Template loaded successfully');
      break;
    case 'RSVP_ACCEPTED':
      handleRSVPSubmission(data.rsvpData);
      break;
    case 'INVITATION_VIEWED':
      trackAnalytics(data);
      break;
  }
});
```

## Deployment Considerations

### Environment Variables
The template does not require environment variables for platform integration.

### CORS Configuration
Ensure proper CORS headers for cross-origin PostMessage communication.

### CDN Integration
Template assets can be served via CDN for improved performance.

## Support & Maintenance

### Logging
All platform communications are logged for debugging:
```javascript
console.log('Platform message received:', message);
console.log('RSVP data sent:', rsvpData);
console.log('Analytics tracked:', analyticsData);
```

### Debugging
Enable debug mode by adding `?debug=true` to URL for detailed console output.

### Version Compatibility
Template maintains backward compatibility with previous parameter formats.

---

**Report Generated**: January 2025  
**Template Version**: 1.0  
**Integration Status**: Production Ready  
**Contact**: Royal Indian Wedding Template Team