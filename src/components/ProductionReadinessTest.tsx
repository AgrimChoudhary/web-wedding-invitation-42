import React, { useEffect, useState } from 'react';
import { usePlatform } from '@/context/PlatformContext';
import { useWedding } from '@/context/WeddingContext';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, AlertCircle, TestTube2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

const ProductionReadinessTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { platformData, weddingData, isPlatformMode } = usePlatform();
  const { weddingData: contextWeddingData } = useWedding();

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const results: TestResult[] = [];
    const data = weddingData || contextWeddingData;

    // Test 1: Basic Data Structure
    results.push({
      name: 'Data Structure',
      status: data ? 'pass' : 'fail',
      message: data ? 'Wedding data is available' : 'No wedding data found',
      details: { hasData: Boolean(data), dataKeys: data ? Object.keys(data) : [] }
    });

    if (data) {
      // Test 2: Couple Information
      const coupleTest = {
        groomName: Boolean(data.couple?.groomFirstName && data.couple?.groomLastName),
        brideName: Boolean(data.couple?.brideFirstName && data.couple?.brideLastName),
        coupleImage: Boolean(data.couple?.coupleImageUrl),
        cities: Boolean(data.couple?.groomCity || data.couple?.brideCity)
      };
      
      results.push({
        name: 'Couple Information',
        status: coupleTest.groomName && coupleTest.brideName ? 'pass' : 'fail',
        message: `Groom: ${coupleTest.groomName ? '✓' : '✗'}, Bride: ${coupleTest.brideName ? '✓' : '✗'}`,
        details: coupleTest
      });

      // Test 3: Family Data
      const familyTest = {
        brideFamily: {
          exists: Boolean(data.family?.brideFamily),
          hasPhoto: Boolean(data.family?.brideFamily?.familyPhotoUrl?.trim()),
          hasParents: Boolean(data.family?.brideFamily?.parentsNameCombined?.trim()),
          memberCount: data.family?.brideFamily?.members?.length || 0
        },
        groomFamily: {
          exists: Boolean(data.family?.groomFamily),
          hasPhoto: Boolean(data.family?.groomFamily?.familyPhotoUrl?.trim()),
          hasParents: Boolean(data.family?.groomFamily?.parentsNameCombined?.trim()),
          memberCount: data.family?.groomFamily?.members?.length || 0
        }
      };

      const familyStatus = (familyTest.brideFamily.exists && familyTest.groomFamily.exists) ? 'pass' : 
                          (familyTest.brideFamily.exists || familyTest.groomFamily.exists) ? 'warning' : 'fail';

      results.push({
        name: 'Family Data',
        status: familyStatus,
        message: `Bride: ${familyTest.brideFamily.memberCount} members, Groom: ${familyTest.groomFamily.memberCount} members`,
        details: familyTest
      });

      // Test 4: Family Photos
      const photoUrls = {
        bridePhoto: data.family?.brideFamily?.familyPhotoUrl,
        groomPhoto: data.family?.groomFamily?.familyPhotoUrl,
        coupleImage: data.couple?.coupleImageUrl
      };

      const hasPhotos = Object.values(photoUrls).some(url => url && url.trim() !== '');
      
      results.push({
        name: 'Photo URLs',
        status: hasPhotos ? 'pass' : 'warning',
        message: hasPhotos ? 'Family/couple photos found' : 'No photos configured',
        details: photoUrls
      });

      // Test 5: Venue Information
      const venueTest = {
        name: Boolean(data.mainWedding?.venue?.name),
        address: Boolean(data.mainWedding?.venue?.address),
        date: Boolean(data.mainWedding?.date),
        time: Boolean(data.mainWedding?.time)
      };

      results.push({
        name: 'Venue & Date',
        status: venueTest.name && venueTest.date ? 'pass' : 'fail',
        message: `Venue: ${venueTest.name ? '✓' : '✗'}, Date: ${venueTest.date ? '✓' : '✗'}`,
        details: venueTest
      });

      // Test 6: Events
      results.push({
        name: 'Events',
        status: (data.events?.length || 0) > 0 ? 'pass' : 'warning',
        message: `${data.events?.length || 0} events configured`,
        details: { count: data.events?.length || 0 }
      });

      // Test 7: Photo Gallery
      results.push({
        name: 'Photo Gallery',
        status: (data.photoGallery?.length || 0) > 0 ? 'pass' : 'warning',
        message: `${data.photoGallery?.length || 0} photos in gallery`,
        details: { count: data.photoGallery?.length || 0 }
      });

      // Test 8: Contacts
      results.push({
        name: 'Contacts',
        status: (data.contacts?.length || 0) > 0 ? 'pass' : 'warning',
        message: `${data.contacts?.length || 0} contacts configured`,
        details: { count: data.contacts?.length || 0 }
      });
    }

    // Test 9: Platform Integration
    results.push({
      name: 'Platform Integration',
      status: isPlatformMode ? 'pass' : 'warning',
      message: isPlatformMode ? 'Running in platform mode' : 'Running in standalone mode',
      details: { isPlatformMode, hasPlatformData: Boolean(platformData) }
    });

    setTestResults(results);
    setIsRunning(false);

    // Show summary toast
    const passCount = results.filter(r => r.status === 'pass').length;
    const totalCount = results.length;
    const statusSummary = `${passCount}/${totalCount} tests passed`;

    toast({
      title: "Production Readiness Test Complete",
      description: statusSummary,
      variant: passCount === totalCount ? "default" : "destructive"
    });
  };

  // Auto-run test when data changes
  useEffect(() => {
    if (weddingData || contextWeddingData) {
      const timer = setTimeout(runComprehensiveTest, 2000);
      return () => clearTimeout(timer);
    }
  }, [weddingData, contextWeddingData, isPlatformMode]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'fail': return <XCircle size={16} className="text-red-600" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-50 border-green-200';
      case 'fail': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TestTube2 size={18} className="text-blue-600" />
          <h3 className="font-semibold text-sm text-gray-800">Production Readiness</h3>
          <button
            onClick={runComprehensiveTest}
            disabled={isRunning}
            className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Testing...' : 'Test'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className={`p-2 rounded border ${getStatusColor(result.status)}`}>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(result.status)}
                  <span className="text-xs font-medium text-gray-700">{result.name}</span>
                </div>
                <p className="text-xs text-gray-600">{result.message}</p>
                {result.details && (
                  <details className="mt-1">
                    <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                    <pre className="text-xs text-gray-500 mt-1 overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {testResults.length === 0 && !isRunning && (
          <p className="text-xs text-gray-500">Click 'Test' to run comprehensive checks</p>
        )}
      </div>
    </div>
  );
};

export default ProductionReadinessTest;