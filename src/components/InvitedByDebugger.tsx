import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InvitedByDebuggerProps {
  eventDetails?: {
    invitedBy?: string;
  };
  platformData?: any;
  finalValue: string | null;
  sampleData?: any;
}

const InvitedByDebugger: React.FC<InvitedByDebuggerProps> = ({
  eventDetails,
  platformData,
  finalValue,
  sampleData
}) => {
  const [debugPanelOpen, setDebugPanelOpen] = useState(false);
  
  // STEP 0: Debug guard
  const DEBUG_INVITED_BY = new URLSearchParams(window.location.search).has("debug");
  
  if (!DEBUG_INVITED_BY) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white text-xs p-3 rounded-lg shadow-lg max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">InvitedBy Debug Panel</span>
        <button 
          onClick={() => setDebugPanelOpen(!debugPanelOpen)}
          className="ml-2 hover:text-gray-300"
        >
          {debugPanelOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      
      <div className="mb-2">
        {sampleData ? (
          <span className="text-green-400">✓ Dataset Loaded</span>
        ) : (
          <span className="text-yellow-400">⟳ Sample dataset available</span>
        )}
      </div>

      <div className="mb-2">
        <strong>Data Sources:</strong><br />
        <span className="text-blue-300">
          eventDetails.invitedBy: <span className="text-yellow-200">{eventDetails?.invitedBy || 'undefined'}</span><br />
          platformData.invitedBy: <span className="text-yellow-200">{platformData?.invitedBy || 'undefined'}</span><br />
          URL param invitedBy: <span className="text-yellow-200">{new URLSearchParams(window.location.search).get('invitedBy') || 'undefined'}</span><br />
          platformData.structuredData.weddingData.invitedBy: <span className="text-yellow-200">{platformData?.structuredData?.weddingData?.invitedBy || 'undefined'}</span><br />
          <strong className="text-green-300">Final value: {finalValue || 'undefined'}</strong>
        </span>
      </div>

      <div className="mb-2">
        <strong>Status:</strong><br />
        <span className={finalValue ? "text-green-400" : "text-red-400"}>
          {finalValue ? `✓ Rendering: "${finalValue}"` : "✗ Not rendering - no valid invitedBy found"}
        </span>
      </div>

      {debugPanelOpen && sampleData && (
        <details className="mt-2">
          <summary className="cursor-pointer hover:text-gray-300">Sample Dataset (Expected Structure)</summary>
          <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-800 p-2 rounded">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </details>
      )}

      {debugPanelOpen && (
        <details className="mt-2">
          <summary className="cursor-pointer hover:text-gray-300">Runtime Data</summary>
          <div className="mt-2 text-xs">
            <div className="mb-2">
              <strong>eventDetails:</strong>
              <pre className="bg-gray-800 p-1 rounded mt-1 overflow-auto max-h-20">
                {JSON.stringify(eventDetails, null, 2)}
              </pre>
            </div>
            <div>
              <strong>platformData (invitedBy paths):</strong>
              <pre className="bg-gray-800 p-1 rounded mt-1 overflow-auto max-h-20">
                {JSON.stringify({
                  invitedBy: platformData?.invitedBy,
                  structuredData: platformData?.structuredData ? {
                    weddingData: platformData.structuredData.weddingData ? {
                      invitedBy: platformData.structuredData.weddingData.invitedBy
                    } : null
                  } : null
                }, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      )}

      {debugPanelOpen && (
        <details className="mt-2">
          <summary className="cursor-pointer hover:text-gray-300">Test Instructions</summary>
          <div className="mt-2 text-xs text-gray-300">
            <p>To test invitedBy rendering:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Add <code>?invitedBy=Test%20Name</code> to URL</li>
              <li>Check if "Invited By Test Name" appears</li>
              <li>Verify data source in this panel</li>
              <li>Remove <code>?debug</code> to hide this panel</li>
            </ol>
          </div>
        </details>
      )}
    </div>
  );
};

export default InvitedByDebugger;