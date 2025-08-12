// Quick diagnostic script to run in browser console
// Copy and paste this in your browser console while on the template page

console.log('🔍 QUICK DIAGNOSTIC START');

// Test 1: Check if we're in iframe
console.log('📍 Test 1: Environment Check');
console.log('Window parent exists:', window.parent !== window);
console.log('Current URL:', window.location.href);

// Test 2: Check URL parameters
console.log('📍 Test 2: URL Parameters');
const urlParams = new URLSearchParams(window.location.search);
console.log('Event ID:', urlParams.get('eventId'));
console.log('Guest ID:', urlParams.get('guestId'));
console.log('Guest Name:', urlParams.get('guestName'));
console.log('All URL params:', Object.fromEntries(urlParams.entries()));

// Test 3: Test basic postMessage
console.log('📍 Test 3: Basic PostMessage Test');
try {
    const testMessage = {
        type: 'TEST_MESSAGE',
        payload: { test: true },
        timestamp: Date.now()
    };
    window.parent.postMessage(testMessage, '*');
    console.log('✅ Basic postMessage sent successfully');
} catch (error) {
    console.error('❌ PostMessage failed:', error);
}

// Test 4: Test wish submission message format
console.log('📍 Test 4: Wish Message Format Test');
const guestId = urlParams.get('guestId') || 'test-guest';
const guestName = urlParams.get('guestName') || 'Test Guest';

const testWishData = {
    guest_id: guestId,
    guest_name: guestName,
    content: 'Test wish from diagnostic script',
    image_data: null,
    image_filename: null,
    image_type: null
};

const testWishMessage = {
    type: 'SUBMIT_NEW_WISH',
    payload: testWishData,
    timestamp: Date.now(),
    source: 'DIAGNOSTIC'
};

console.log('📦 Test wish message:', testWishMessage);

try {
    window.parent.postMessage(testWishMessage, '*');
    console.log('✅ Test wish message sent successfully');
} catch (error) {
    console.error('❌ Test wish message failed:', error);
}

// Test 5: Listen for platform responses
console.log('📍 Test 5: Setting up message listener');
const messageListener = (event) => {
    console.log('📥 Received message from platform:', event.data);
    if (event.data && event.data.type && event.data.type.includes('WISH')) {
        console.log('🎁 Wish-related message received:', event.data);
    }
};

window.addEventListener('message', messageListener);
console.log('✅ Message listener set up');

// Test 6: Check for JavaScript errors
console.log('📍 Test 6: Error Detection');
window.addEventListener('error', (event) => {
    console.error('🚨 JavaScript Error detected:', event.error);
});

console.log('🔍 DIAGNOSTIC COMPLETE - Check logs above for issues');
console.log('💡 To remove the message listener, run: window.removeEventListener("message", messageListener)');
