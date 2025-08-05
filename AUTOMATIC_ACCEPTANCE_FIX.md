# Automatic Acceptance Fix

## Problem
The "Royal Indian Wedding" template was automatically accepting invitations when the URL contained parameters like `accepted=true` or `hasResponded=true`. This meant that guests would see the "Thank You" message immediately without having to click the "Accept Invitation" button.

## Root Cause
The issue was in two main files:
1. `src/hooks/useUrlParams.tsx` - Was parsing URL parameters and automatically setting `accepted: true` and `hasResponded: true` based on URL values
2. `src/context/PlatformContext.tsx` - Was not preventing automatic acceptance from URL parameters

## Solution
Modified both files to prevent automatic acceptance from URL parameters:

### 1. useUrlParams.tsx Changes
- Always set `hasResponded: false` regardless of URL parameters
- Always set `accepted: false` regardless of URL parameters  
- Always set `guestStatus: 'invited'` regardless of URL parameters
- Added console logs to track when automatic acceptance is being prevented

### 2. PlatformContext.tsx Changes
- Added safety wrapper that ensures platform data always starts with `invited` status
- Prevents automatic acceptance from both URL parameters and structured data
- Added console logs to track prevention of automatic acceptance

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
```

## Result
Now guests must explicitly click the "Accept Invitation" button to accept the invitation. The RSVP status will only change from "invited" to "accepted" when the user takes action, not automatically from URL parameters.

## Testing
To test the fix:
1. Open the invitation with URL parameters like `?accepted=true&hasResponded=true`
2. Verify that the invitation shows the "Accept Invitation" button instead of the "Thank You" message
3. Click the "Accept Invitation" button to verify it works correctly
4. Check browser console for prevention logs: `🛡️ Preventing automatic acceptance`

## Files Modified
- `src/hooks/useUrlParams.tsx`
- `src/context/PlatformContext.tsx`
- `AUTOMATIC_ACCEPTANCE_FIX.md` (this file) 