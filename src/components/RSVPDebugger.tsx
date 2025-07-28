import React from 'react';
import { usePlatform } from '../context/PlatformContext';

/**
 * Debug component to track RSVP button visibility logic
 * This component shows the current state of all RSVP-related data
 * to help troubleshoot button visibility issues after page refresh
 */
export const RSVPDebugger: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  const { 
    guestStatus, 
    existingRsvpData, 
    rsvpConfig, 
    isPlatformMode, 
    platformData 
  } = usePlatform();

  if (!enabled) return null;

  const debugData = {
    timestamp: new Date().toISOString(),
    rsvpConfig,
    guestStatus,
    hasExistingData: !!existingRsvpData,
    existingRsvpData,
    isPlatformMode,
    platformDataLoaded: !!platformData,
    platformFlags: platformData ? {
      canSubmitRsvp: platformData.canSubmitRsvp,
      canEditRsvp: platformData.canEditRsvp,
      showSubmitButton: platformData.showSubmitButton,
      showEditButton: platformData.showEditButton,
      hasCustomFields: platformData.hasCustomFields,
      allowEditAfterSubmit: platformData.allowEditAfterSubmit,
      guestStatus: platformData.guestStatus,
      eventId: platformData.eventId,
      guestId: platformData.guestId
    } : null
  };

  // Log the debug data for console inspection
  console.log('[RSVP DEBUGGER] 🐛 Current RSVP state:', debugData);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md text-xs font-mono z-50 max-h-96 overflow-y-auto">
      <h3 className="text-yellow-400 font-bold mb-2">🐛 RSVP Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Config:</strong> {rsvpConfig}</div>
        <div><strong>Status:</strong> {guestStatus}</div>
        <div><strong>Platform Mode:</strong> {isPlatformMode ? 'Yes' : 'No'}</div>
        <div><strong>Platform Data:</strong> {platformData ? 'Loaded' : 'Missing'}</div>
        <div><strong>Existing RSVP:</strong> {existingRsvpData ? 'Yes' : 'No'}</div>
        
        {platformData && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-yellow-400 font-bold">Platform Flags:</div>
            <div><strong>canSubmitRsvp:</strong> {platformData.canSubmitRsvp ? '✅' : '❌'}</div>
            <div><strong>canEditRsvp:</strong> {platformData.canEditRsvp ? '✅' : '❌'}</div>
            <div><strong>showSubmitButton:</strong> {platformData.showSubmitButton ? '✅' : '❌'}</div>
            <div><strong>showEditButton:</strong> {platformData.showEditButton ? '✅' : '❌'}</div>
            <div><strong>hasCustomFields:</strong> {platformData.hasCustomFields ? '✅' : '❌'}</div>
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-300">
          <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};