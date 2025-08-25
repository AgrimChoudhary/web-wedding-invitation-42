import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { usePlatform } from '@/context/PlatformContext';
import { toast } from 'sonner';

const FamilyDataDebugger: React.FC = () => {
  const { weddingData } = useWedding();
  const { platformData, isPlatformMode } = usePlatform();

  const checkFamilyData = () => {
    console.group('🔍 FAMILY DATA VERIFICATION');
    
    // Check if we're in platform mode
    console.log('Platform Mode:', isPlatformMode);
    console.log('Platform Data:', platformData);
    
    // Check wedding data family structure
    console.log('Wedding Data Family Structure:', weddingData?.family);
    console.log('Groom Family Members:', weddingData?.family?.groomFamily?.members);
    console.log('Bride Family Members:', weddingData?.family?.brideFamily?.members);
    
    // Check if we have actual family data
    const hasGroomFamilyData = weddingData?.family?.groomFamily?.members && weddingData.family.groomFamily.members.length > 0;
    const hasBrideFamilyData = weddingData?.family?.brideFamily?.members && weddingData.family.brideFamily.members.length > 0;
    
    console.log('Has Groom Family Data:', hasGroomFamilyData);
    console.log('Has Bride Family Data:', hasBrideFamilyData);
    console.log('Groom Family Member Count:', weddingData?.family?.groomFamily?.members?.length || 0);
    console.log('Bride Family Member Count:', weddingData?.family?.brideFamily?.members?.length || 0);
    
    if (hasGroomFamilyData) {
      console.log('Groom Family Details:', {
        title: weddingData?.family?.groomFamily?.title,
        photo: weddingData?.family?.groomFamily?.familyPhotoUrl,
        parents: weddingData?.family?.groomFamily?.parentsNameCombined,
        memberCount: weddingData?.family?.groomFamily?.members?.length,
        members: weddingData?.family?.groomFamily?.members
      });
    }
    
    if (hasBrideFamilyData) {
      console.log('Bride Family Details:', {
        title: weddingData?.family?.brideFamily?.title,
        photo: weddingData?.family?.brideFamily?.familyPhotoUrl,
        parents: weddingData?.family?.brideFamily?.parentsNameCombined,
        memberCount: weddingData?.family?.brideFamily?.members?.length,
        members: weddingData?.family?.brideFamily?.members
      });
    }
    
    // Check URL params and platform data for family info
    if (platformData && (platformData as any).eventDetails) {
      console.log('Platform Event Details bride_family:', (platformData as any).eventDetails.bride_family);
      console.log('Platform Event Details groom_family:', (platformData as any).eventDetails.groom_family);
    }
    
    console.groupEnd();
    
    // Show toast with detailed results
    const groomCount = weddingData?.family?.groomFamily?.members?.length || 0;
    const brideCount = weddingData?.family?.brideFamily?.members?.length || 0;
    const message = `Family Data: Groom ${hasGroomFamilyData ? `✅ (${groomCount})` : '❌'}, Bride ${hasBrideFamilyData ? `✅ (${brideCount})` : '❌'}`;
    toast(message, {
      description: `Platform Mode: ${isPlatformMode ? 'Yes' : 'No'}`,
      duration: 5000
    });
  };

  React.useEffect(() => {
    // Auto-check on mount and when data changes
    checkFamilyData();
  }, [weddingData?.family, platformData, isPlatformMode]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={checkFamilyData}
        className="bg-primary text-white px-4 py-2 rounded-md text-sm shadow-lg hover:bg-primary/90 transition-colors"
      >
        🔍 Check Family Data
      </button>
    </div>
  );
};

export default FamilyDataDebugger;