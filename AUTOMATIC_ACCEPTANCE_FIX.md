# Automatic Acceptance Fix

## Problem
The "Royal Indian Wedding" template was automatically accepting invitations when the URL contained parameters like `accepted=true` or `hasResponded=true`. This meant that guests would see the "Thank You" message immediately without having to click the "Accept Invitation" button.

## Root Cause
The issue was in multiple files and systems:
1. `src/hooks/useUrlParams.tsx` - Was parsing URL parameters and automatically setting `accepted: true` and `hasResponded: true` based on URL values
2. `src/context/PlatformContext.tsx` - Was not preventing automatic acceptance from URL parameters and PostMessage data
3. PostMessage handling was allowing automatic acceptance from platform data
4. **DUAL RSVP SYSTEMS**: The `Invitation.tsx` file was using both an old `showThankYouMessage` state AND the new PlatformContext system, causing conflicts

## Solution
Modified multiple files to prevent automatic acceptance from all sources and unified the RSVP system:

### 1. useUrlParams.tsx Changes
- Always set `hasResponded: false` regardless of URL parameters
- Always set `accepted: false` regardless of URL parameters  
- Always set `guestStatus: 'invited'` regardless of URL parameters
- Added console logs to track when automatic acceptance is being prevented

### 2. PlatformContext.tsx Changes
- Added safety wrapper that ensures platform data always starts with `invited` status
- Prevents automatic acceptance from both URL parameters and structured data
- Fixed PostMessage handling to prevent automatic acceptance from platform data
- Fixed `hasResponded` value to only be true when user explicitly submits RSVP data
- Added console logs to track prevention of automatic acceptance

### 3. PostMessage Handling Fixes
- `INVITATION_LOADED` messages: Always set `guestStatus: 'invited'` unless explicitly `'submitted'`
- `INVITATION_PAYLOAD_UPDATE` messages: Always set `guestStatus: 'invited'` unless explicitly `'submitted'`
- Added debugging logs for both message types

### 4. **UNIFIED RSVP SYSTEM** (Final Fix)
- **Removed old `showThankYouMessage` state** from `Invitation.tsx`
- **Removed old `handleAcceptInvitation` function** that was bypassing PlatformContext
- **Removed old thank you message rendering** that was conflicting with RSVPSection
- **Now only uses RSVPSection component** which properly handles `guestStatus` from PlatformContext
- **Single source of truth**: Only PlatformContext controls RSVP state

## Key Changes Made

### In useUrlParams.tsx:
```typescript
// Before (problematic):
hasResponded: urlParams.get('hasResponded') === 'true',
accepted: urlParams.get('accepted') === 'true',

// After (fixed):
hasResponded: false, // Always start as false, regardless of URL
accepted: false, // Always start as false, regardless of URL
guestStatus: 'invited' as const, // Always start as invited
```

### In PlatformContext.tsx:
```typescript
// Added safety wrapper:
const safePlatformData = {
  ...urlPlatformData,
  guestStatus: 'invited' as const,
  hasResponded: false,
  accepted: false
};

// Fixed PostMessage handling:
guestStatus: payload.status === 'submitted' ? 'submitted' : 'invited',

// Fixed hasResponded value:
hasResponded: Boolean(platformData?.guestStatus === 'submitted'),
```

### In Invitation.tsx (Final Fix):
```typescript
// Before (conflicting systems):
const [showThankYouMessage, setShowThankYouMessage] = useState(false);
{showThankYouMessage ? <ThankYouMessage /> : <RSVPSection />}

// After (unified system):
<RSVPSection /> // Only uses PlatformContext guestStatus
```

## Result
Now guests must explicitly click the "Accept Invitation" button to accept the invitation. The RSVP status will only change from "invited" to "accepted" when the user takes action, not automatically from:
- URL parameters
- Platform PostMessage data
- Structured data parameters
- **No more conflicting RSVP systems**

## Testing
To test the fix:
1. Open the invitation with URL parameters like `?accepted=true&hasResponded=true`
2. Verify that the invitation shows the "Accept Invitation" button instead of the "Thank You" message
3. Click the "Accept Invitation" button to verify it works correctly
4. Check browser console for prevention logs: `🛡️ Preventing automatic acceptance`

## Console Logs to Look For
- `🛡️ Preventing automatic acceptance from URL parameters`
- `🛡️ URL Parameters - Preventing automatic acceptance`
- `🛡️ Structured Data - Preventing automatic acceptance`
- `🛡️ PostMessage - Preventing automatic acceptance`
- `🛡️ INVITATION_PAYLOAD_UPDATE - Preventing automatic acceptance`

## Files Modified
- `src/hooks/useUrlParams.tsx`
- `src/context/PlatformContext.tsx`
- `src/pages/Invitation.tsx` (removed old RSVP system)
- `AUTOMATIC_ACCEPTANCE_FIX.md` (this file) 