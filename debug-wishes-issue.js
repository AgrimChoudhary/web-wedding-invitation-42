/**
 * DEBUG SCRIPT: Wishes Issue Diagnostics
 * 
 * इस script को browser console में run करें to debug wishes issues
 * This script helps diagnose why wishes are not appearing
 */

console.log('🔧 WISHES DEBUG SCRIPT - Starting diagnostics...');

// 1. Check if we're in iframe
const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

console.log('📍 Environment Check:');
console.log('   - Running in iframe:', isInIframe());
console.log('   - Window origin:', window.location.origin);
console.log('   - Parent exists:', !!window.parent);

// 2. Check communication setup
console.log('\n📡 Communication Check:');

// Test message to platform
const testMessage = {
  type: 'REQUEST_INITIAL_WISHES_DATA',
  payload: { debug: true }
};

console.log('   - Sending test message to platform:', testMessage);

try {
  window.parent.postMessage(testMessage, '*');
  console.log('   ✅ Test message sent successfully');
} catch (error) {
  console.error('   ❌ Failed to send test message:', error);
}

// 3. Set up message listener for responses
console.log('\n👂 Setting up debug message listener...');

const debugMessageListener = (event) => {
  console.log('📥 DEBUG: Received message from platform:');
  console.log('   - Origin:', event.origin);
  console.log('   - Message type:', event.data?.type);
  console.log('   - Full message:', event.data);
  
  if (event.data?.type === 'INITIAL_WISHES_DATA') {
    console.log('✅ DEBUG: Wishes data received!');
    console.log('   - Wishes count:', event.data.payload?.wishes?.length || 0);
    console.log('   - Sample wish:', event.data.payload?.wishes?.[0]);
  } else if (event.data?.type === 'ERROR') {
    console.error('❌ DEBUG: Error received:', event.data.payload);
  }
};

window.addEventListener('message', debugMessageListener);

// 4. Timeout to check for response
setTimeout(() => {
  console.log('\n⏰ DEBUG: 10-second timeout reached');
  console.log('   - If no wishes data received, there may be a platform issue');
  console.log('   - Check platform console for handler registration errors');
  window.removeEventListener('message', debugMessageListener);
}, 10000);

// 5. Helper functions to check DOM state
console.log('\n🔍 DOM State Check:');

setTimeout(() => {
  const wishesCarousel = document.querySelector('[data-testid="wishes-carousel"]') || 
                        document.querySelector('div[class*="wishes"]') ||
                        document.querySelector('div[class*="carousel"]');
  
  console.log('   - Wishes carousel element:', !!wishesCarousel);
  
  const wishCards = document.querySelectorAll('[data-testid="wish-card"]') || 
                   document.querySelectorAll('div[class*="wish-card"]');
  
  console.log('   - Wish cards found:', wishCards.length);
  
  const loadingElements = document.querySelectorAll('[class*="loading"]') ||
                         document.querySelectorAll('[class*="skeleton"]');
  
  console.log('   - Loading elements:', loadingElements.length);
}, 2000);

// 6. Common solutions
console.log('\n💡 COMMON SOLUTIONS:');
console.log('   1. Ensure platform iframe has data-template-iframe="true" attribute');
console.log('   2. Check that WishMessageHandlerService is registered for this eventId');
console.log('   3. Verify database has approved wishes for this event');
console.log('   4. Ensure proper CORS/Origin settings on platform');
console.log('   5. Check browser console on both template and platform sides');

// 7. Export debug info to global scope
window.wishesDebugInfo = {
  isInIframe: isInIframe(),
  origin: window.location.origin,
  testMessage: testMessage,
  timestamp: new Date().toISOString(),
  
  // Function to manually trigger wish request
  requestWishes: () => {
    console.log('🔄 Manually requesting wishes...');
    window.parent.postMessage({
      type: 'REQUEST_INITIAL_WISHES_DATA',
      payload: { manual: true, timestamp: Date.now() }
    }, '*');
  },
  
  // Function to check current state
  checkState: () => {
    console.log('📊 Current State Check:');
    console.log('   - URL:', window.location.href);
    console.log('   - Local storage:', localStorage.getItem('wishes') ? 'exists' : 'empty');
    console.log('   - Session storage:', sessionStorage.getItem('wishes') ? 'exists' : 'empty');
  }
};

console.log('\n🎯 Debug script completed!');
console.log('   - Access debug functions via: window.wishesDebugInfo');
console.log('   - Manual wish request: window.wishesDebugInfo.requestWishes()');
console.log('   - State check: window.wishesDebugInfo.checkState()');
console.log('\n==========================================');
