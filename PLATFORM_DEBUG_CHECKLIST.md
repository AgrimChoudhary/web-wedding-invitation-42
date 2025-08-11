# 🚨 Platform Debug Checklist - Wishes Connection Failed

## Current Issue Analysis
- ✅ Template is working (WishesCarousel loading properly)
- ❌ Platform not responding to REQUEST_INITIAL_WISHES_DATA
- ❌ 15-second timeout triggering 
- ❌ "Connection Failed" error toast showing
- ❌ Total wishes: 0, No data from platform

## 🔍 Step 1: Platform Console Check

**Platform side (utsavy1-05) console में ये commands run करें:**

```javascript
// 1. Check if iframe exists with proper attribute
const iframe = document.querySelector('iframe[data-template-iframe="true"]');
console.log('🖼️ Template iframe found:', !!iframe);
console.log('🖼️ Iframe src:', iframe?.src);
console.log('🖼️ ContentWindow exists:', !!iframe?.contentWindow);

// 2. Check registered handlers
console.log('📋 Registered wish handlers:', WishMessageHandlerService.getRegisteredHandlers());

// 3. Check event ID
const eventId = new URLSearchParams(window.location.search).get('eventId') || 
               window.location.pathname.split('/').pop();
console.log('🎯 Current eventId:', eventId);
console.log('🎯 EventId type:', typeof eventId);

// 4. Manual handler registration (if needed)
if (iframe && eventId) {
  WishMessageHandlerService.registerHandler(eventId, iframe);
  console.log('✅ Handler manually registered');
}
```

## 🔍 Step 2: Message Event Listener Check

**Platform console में:**

```javascript
// Set up debug listener for template messages
const debugListener = (event) => {
  console.log('📥 PLATFORM: Message from template:', event.data);
  if (event.data?.type === 'REQUEST_INITIAL_WISHES_DATA') {
    console.log('🎯 PLATFORM: Wish data request detected!');
    console.log('🎯 PLATFORM: Event origin:', event.origin);
  }
};

window.addEventListener('message', debugListener);

// Remove after 30 seconds
setTimeout(() => {
  window.removeEventListener('message', debugListener);
  console.log('🧹 Debug listener removed');
}, 30000);
```

## 🔍 Step 3: Database Direct Check

**Platform console में database check:**

```javascript
// Replace YOUR_EVENT_ID with actual event ID
const checkWishes = async () => {
  const eventId = 'YOUR_EVENT_ID'; // Replace with actual event ID
  
  console.log('🗄️ Checking database for wishes...');
  console.log('🗄️ Event ID:', eventId);
  
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('event_id', eventId);
    
    console.log('✅ Database query result:');
    console.log('   - Error:', error);
    console.log('   - Total wishes:', data?.length || 0);
    console.log('   - Approved wishes:', data?.filter(w => w.is_approved)?.length || 0);
    console.log('   - Sample wish:', data?.[0]);
    
  } catch (err) {
    console.error('❌ Database error:', err);
  }
};

checkWishes();
```

## 🔍 Step 4: Iframe Integration Check

**Platform में iframe setup verify करें:**

```javascript
// Check if iframe has proper attributes
const iframes = document.querySelectorAll('iframe');
console.log('🖼️ All iframes found:', iframes.length);

iframes.forEach((iframe, index) => {
  console.log(`🖼️ Iframe ${index + 1}:`, {
    src: iframe.src,
    hasTemplateAttribute: iframe.hasAttribute('data-template-iframe'),
    templateAttribute: iframe.getAttribute('data-template-iframe'),
    contentWindow: !!iframe.contentWindow
  });
});
```

## 🛠️ Quick Fixes to Try

### Fix 1: Manual Handler Registration
```javascript
// In platform console:
const iframe = document.querySelector('iframe');
const eventId = window.location.pathname.split('/').pop();

if (iframe && eventId) {
  iframe.setAttribute('data-template-iframe', 'true');
  WishMessageHandlerService.registerHandler(eventId, iframe);
  console.log('✅ Manual fix applied');
}
```

### Fix 2: Force Message Processing
```javascript
// In platform console, simulate message processing:
const eventId = 'YOUR_EVENT_ID'; // Replace
const mockEvent = {
  data: {
    type: 'REQUEST_INITIAL_WISHES_DATA',
    payload: {}
  },
  origin: 'https://your-template-domain.vercel.app'
};

WishMessageHandlerService.handleMessage(mockEvent, eventId);
```

## 📋 Expected Results

### ✅ Success Signs:
- `Template iframe found: true`
- `Registered wish handlers: ["your-event-id"]`
- `Handler manually registered` message
- Platform logs showing `PLATFORM: Wish data request detected!`
- Database returns wishes data

### ❌ Problem Signs:
- `Template iframe found: false`
- `Registered wish handlers: []`
- Database query errors
- No message exchange logs

---

**Run करने के बाद results share करें ताकि exact issue identify कर सकें!**
