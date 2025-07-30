# RSVP Section Communication Guide

## Overview
This document explains how the wedding invitation template communicates with the platform for RSVP functionality. The system handles a 4-stage guest journey with robust platform integration and fallback mechanisms.

## 🎯 Guest Journey & Status Flow

### 1. **PENDING** → Guest invited but hasn't viewed invitation yet
- **Template Action**: No UI shown (returns `null`)
- **Platform Action**: Sends `LOAD_INVITATION_DATA` when guest opens link

### 2. **VIEWED** → Guest has opened invitation
- **Template Action**: 
  - Automatically sends `INVITATION_VIEWED` message on mount
  - Shows "Accept Invitation" button
- **Platform Action**: Updates guest status to "viewed"

### 3. **ACCEPTED** → Guest clicked "Accept Invitation"
- **Template Action**: 
  - Shows thank you message with confetti
  - Shows "Submit RSVP Details" button (if `canSubmitRSVP` is true)
- **Platform Action**: Receives `RSVP_ACCEPTED` message, updates status

### 4. **SUBMITTED** → Guest completed detailed RSVP form
- **Template Action**: 
  - Shows thank you message
  - Shows "Edit RSVP Details" button (if `canEditRSVP` is true)
- **Platform Action**: Receives `RSVP_UPDATED` message with form data

---

## 📡 Message Communication Protocol

### **Template → Platform Messages**

#### 1. `TEMPLATE_READY`
```typescript
{
  type: 'TEMPLATE_READY',
  timestamp: Date.now(),
  source: 'template'
}
```
- **When**: Sent immediately when template loads
- **Purpose**: Notifies platform that template is ready to receive data

#### 2. `INVITATION_VIEWED`
```typescript
{
  type: 'INVITATION_VIEWED',
  timestamp: Date.now(),
  source: 'template',
  data: {
    eventId: string,
    guestId: string
  }
}
```
- **When**: Sent automatically when RSVPSection component mounts
- **Purpose**: Track that guest has viewed the invitation

#### 3. `RSVP_ACCEPTED`
```typescript
{
  type: 'RSVP_ACCEPTED',
  timestamp: Date.now(),
  source: 'template',
  data: {
    eventId: string,
    guestId: string,
    rsvpData: {} // Empty object for simple acceptance
  }
}
```
- **When**: Sent when guest clicks "Accept Invitation" button
- **Purpose**: Register guest acceptance of invitation
- **Template Behavior**: Immediately updates local status to 'accepted' for instant UI feedback

#### 4. `RSVP_UPDATED`
```typescript
{
  type: 'RSVP_UPDATED',
  timestamp: Date.now(),
  source: 'template',
  data: {
    eventId: string,
    guestId: string,
    rsvpData: {
      [fieldName]: value,
      // Example:
      // "dietary_requirements": "Vegetarian",
      // "attendees": 2,
      // "special_requests": "Wheelchair access needed"
    }
  }
}
```
- **When**: Sent when guest submits detailed RSVP form or edits existing RSVP
- **Purpose**: Update guest RSVP with detailed information
- **Template Behavior**: Updates local status to 'submitted' if not in edit mode

### **Platform → Template Messages**

#### 1. `LOAD_INVITATION_DATA`
```typescript
{
  type: 'LOAD_INVITATION_DATA',
  timestamp: Date.now(),
  source: 'platform',
  data: {
    event: {
      id: string,
      rsvp_config: {
        can_submit_rsvp: boolean,
        can_edit_rsvp: boolean,
        rsvp_closed: boolean,
        deadline_message?: string
      }
    },
    guest: {
      id: string,
      name: string,
      status: 'pending' | 'viewed' | 'accepted' | 'submitted'
    },
    platform_data: {
      customFields: CustomField[],
      existingRsvpData?: Record<string, any>
    },
    structured_data: WeddingData
  }
}
```
- **When**: Sent when guest opens invitation link
- **Purpose**: Provide all necessary data for invitation display and RSVP functionality

#### 2. `STATUS_UPDATE`
```typescript
{
  type: 'STATUS_UPDATE',
  timestamp: Date.now(),
  source: 'platform',
  data: {
    guestId: string,
    status: 'pending' | 'viewed' | 'accepted' | 'submitted',
    rsvpData?: Record<string, any>
  }
}
```
- **When**: Sent when platform updates guest status (can override template's local state)
- **Purpose**: Ensure template stays in sync with platform state

---

## 🔧 Technical Implementation

### **Local State Management**
```typescript
const [localGuestStatus, setLocalGuestStatus] = useState(guestStatus);

// Update local status when platform status changes
useEffect(() => {
  setLocalGuestStatus(guestStatus);
}, [guestStatus]);
```

### **Immediate UI Feedback Pattern**
```typescript
const handleAcceptInvitation = async () => {
  setIsSubmitting(true);
  try {
    // Send to platform
    sendRSVP();
    
    // Immediately update local state for instant UI feedback
    setLocalGuestStatus('accepted');
    setShowConfetti(true);
    
    // Show success feedback
    toast({ title: "Invitation Accepted", ... });
  } catch (error) {
    // Revert local state on error
    setLocalGuestStatus('viewed');
    toast({ title: "Error", variant: "destructive", ... });
  }
}
```

### **Platform vs Standalone Mode**
```typescript
// In PlatformContext
const sendRSVP = (rsvpData?: any) => {
  if (isPlatformMode) {
    // Platform mode: Send message, wait for STATUS_UPDATE
    sendRSVPAccepted(rsvpData || {});
  } else {
    // Standalone mode: Update local state directly
    setPlatformData({ ...platformData, guestStatus: 'accepted' });
  }
};
```

---

## 🎛️ Configuration Options

### **RSVP Capabilities** (from `rsvp_config`)
- **`can_submit_rsvp`**: Controls if "Submit RSVP Details" button shows
- **`can_edit_rsvp`**: Controls if "Edit RSVP Details" button shows
- **`rsvp_closed`**: Shows deadline message instead of RSVP form
- **`deadline_message`**: Custom message for RSVP deadline

### **Custom Fields** (from `customFields`)
```typescript
interface CustomField {
  field_name: string;
  field_label: string;
  field_type: 'text' | 'email' | 'number' | 'textarea' | 'select';
  is_required: boolean;
  max_length?: number;
  options?: string[]; // For select fields
  display_order?: number;
}
```

---

## 🔄 Error Handling & Recovery

### **Platform Communication Failures**
- Template reverts local state changes on error
- Shows error toast with retry option
- Maintains functional UI even without platform connection

### **Status Sync Issues**
- Platform `STATUS_UPDATE` messages can override template's local state
- Template prioritizes platform state over local state when conflicts occur
- Automatic re-sync on page refresh

### **Form Validation**
- Real-time validation for all custom fields
- Type-specific validation (email format, number validation)
- Required field validation
- Maximum length validation

---

## 🧪 Testing Scenarios

### **Happy Path**
1. Guest opens invitation → `INVITATION_VIEWED` sent
2. Guest clicks "Accept" → `RSVP_ACCEPTED` sent, UI shows thank you + confetti
3. Guest clicks "Submit Details" → Form opens
4. Guest fills form → `RSVP_UPDATED` sent, UI shows completion message

### **Error Scenarios**
- Network failure during acceptance → Local state reverts, error shown
- Platform doesn't respond → Template continues functioning with local state
- Invalid form data → Validation errors shown, submission blocked

### **Edge Cases**
- RSVP deadline passed → Shows deadline message instead of form
- No custom fields configured → Shows message in form dialog
- Platform sends unexpected status → Template handles gracefully

---

## 🔍 Debugging Tips

### **Message Monitoring**
- All messages logged to console with detailed data
- Use browser dev tools to monitor postMessage traffic
- Check for CORS issues if messages aren't received

### **State Debugging**
```typescript
console.log('Guest Status:', localGuestStatus);
console.log('Platform Data:', platformData);
console.log('RSVP Config:', rsvpConfig);
```

### **Common Issues**
- **Button not showing thank you**: Check that `handleAcceptInvitation` updates `localGuestStatus`
- **Form not submitting**: Verify custom fields configuration and validation
- **Platform not receiving messages**: Ensure `eventId` and `guestId` are properly set

---

## 📋 Summary

The RSVP system provides a seamless guest experience with:
- ✅ Instant UI feedback for all user actions
- ✅ Robust platform communication with fallbacks
- ✅ Flexible configuration through platform settings
- ✅ Comprehensive error handling and recovery
- ✅ Beautiful animations and user feedback
- ✅ Mobile-responsive design with accessibility support

The template prioritizes user experience while maintaining reliable platform integration through a well-defined message protocol and state management system.