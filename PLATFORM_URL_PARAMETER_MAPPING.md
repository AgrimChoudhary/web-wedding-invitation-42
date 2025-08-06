# Platform URL Parameter Mapping Guide

## Problem Solved
The platform was sending URL parameters with different names than what the template expected, causing status parameters to not work correctly.

## URL Parameter Mapping

### Platform Sends → Template Expects

| Platform Parameter | Template Parameter | Description | Values |
|-------------------|-------------------|-------------|---------|
| `status` | `guestStatus` | Guest RSVP status | `pending`, `viewed`, `accepted`, `submitted` |
| `accepted` | `accepted` | Whether guest accepted | `true`, `false` |
| `hasResponded` | `hasResponded` | Whether guest responded | `true`, `false` |

### Status Value Mapping

| Platform Status | Template Status | Description |
|----------------|-----------------|-------------|
| `pending` | `invited` | Guest hasn't viewed invitation |
| `viewed` | `invited` | Guest viewed but hasn't responded |
| `accepted` | `accepted` | Guest accepted invitation |
| `submitted` | `submitted` | Guest submitted detailed RSVP |

## Changes Made

### 1. Fixed Platform URL Construction (`utsavy1-08-main/src/utils/iframeMessaging.ts`)

**Before (❌ Wrong parameter name):**
```typescript
const urlParams = new URLSearchParams({
  eventId: finalEventId,
  guestId: finalGuestId,
  status: rsvpStatus  // ❌ Template expects 'guestStatus'
});
```

**After (✅ Correct parameter name):**
```typescript
const urlParams = new URLSearchParams({
  eventId: finalEventId,
  guestId: finalGuestId,
  guestStatus: rsvpStatus  // ✅ Template expects 'guestStatus'
});

// Add additional status parameters for template compatibility
params.append('hasResponded', guestData.accepted ? 'true' : 'false');
params.append('accepted', guestData.accepted ? 'true' : 'false');
```

### 2. Added Status Value Mapping (`web-wedding-invitation-42/src/hooks/useUrlParams.tsx`)

**Before (❌ No mapping):**
```typescript
guestStatus: (urlParams.get('guestStatus') as 'invited' | 'accepted' | 'submitted') || 'invited',
```

**After (✅ With mapping):**
```typescript
guestStatus: (() => {
  const status = urlParams.get('guestStatus');
  // Map platform status values to template status values
  if (status === 'pending' || status === 'viewed') return 'invited';
  if (status === 'accepted' || status === 'submitted') return status;
  return 'invited';
})() as 'invited' | 'accepted' | 'submitted',
```

## Example URLs

### Platform-Generated URLs (Now Working)

**Pending Guest:**
```
https://template-url.com/?eventId=123&guestId=456&guestName=John&guestStatus=pending&hasResponded=false&accepted=false
```

**Viewed Guest:**
```
https://template-url.com/?eventId=123&guestId=456&guestName=John&guestStatus=viewed&hasResponded=false&accepted=false
```

**Accepted Guest:**
```
https://template-url.com/?eventId=123&guestId=456&guestName=John&guestStatus=accepted&hasResponded=true&accepted=true
```

**Submitted Guest:**
```
https://template-url.com/?eventId=123&guestId=456&guestName=John&guestStatus=submitted&hasResponded=true&accepted=true
```

## Testing

Use the updated `test-url-params.html` file to test both:
1. **Manual URLs** - Direct parameter testing
2. **Platform-Generated URLs** - Simulating actual platform URLs

### Expected Behavior

| URL Status | Template UI |
|------------|-------------|
| `pending` | Shows "Accept Invitation" button |
| `viewed` | Shows "Accept Invitation" button |
| `accepted` | Shows "Thank You" message (simple RSVP) or "Submit RSVP Details" button (detailed RSVP) |
| `submitted` | Shows "Thank You" message with confirmation |

## Console Logs to Verify

Look for these console logs to verify the fix is working:

```
✅ URL Parameters - Allowing status from URL:
✅ Allowing status from URL parameters:
✅ Added guestStatus=accepted to Royal Wedding template URL
✅ Added hasResponded=true to Royal Wedding template URL
✅ Added accepted=true to Royal Wedding template URL
```

## Files Modified

1. **`utsavy1-08-main/src/utils/iframeMessaging.ts`**
   - Changed `status` parameter to `guestStatus`
   - Added `hasResponded` and `accepted` parameters

2. **`web-wedding-invitation-42/src/hooks/useUrlParams.tsx`**
   - Added status value mapping from platform to template

3. **`web-wedding-invitation-42/test-url-params.html`**
   - Added platform-generated URL test cases

4. **`web-wedding-invitation-42/PLATFORM_URL_PARAMETER_MAPPING.md`**
   - This documentation file

## Result

Now when the platform sends invitation URLs, the template will correctly interpret the status parameters and show the appropriate UI based on the guest's RSVP status. 