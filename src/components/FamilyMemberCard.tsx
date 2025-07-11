
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';

interface FamilyMemberProps {
  name: string;
  relation: string;
  photoUrl?: string;
  description?: string;
  // Add these new props to match what's being passed in FamilyDetails.tsx
  title?: string;
  imageUrl?: string;
}

const FamilyMemberCard: React.FC<FamilyMemberProps> = ({ 
  name, 
  relation, 
  photoUrl, 
  description,
  // Handle the new props
  title,
  imageUrl
}) => {
  // Make sure name is defined before calling split()
  // If title is provided, use that as the name (for compatibility)
  const displayName = title || name || '';
  const actualPhotoUrl = imageUrl || photoUrl; // Use imageUrl if provided

  // Generate initials safely
  const initials = displayName
    ? displayName
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '';

  return (
    <Card className="border border-wedding-gold/20 bg-white/70 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-gold-soft hover:scale-105">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <Avatar className="w-16 h-16 border-2 border-wedding-gold/20">
              <AvatarImage src={actualPhotoUrl} alt={displayName} />
              <AvatarFallback className="bg-wedding-maroon/10 text-wedding-maroon">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-wedding-blush rounded-full p-1">
              <Heart size={12} className="text-wedding-maroon" fill="#AD1457" />
            </div>
          </div>
          
          <h3 className="font-medium text-wedding-maroon">{displayName}</h3>
          <p className="text-sm text-gray-600 italic">{relation}</p>
          
          {description && (
            <p className="mt-2 text-xs text-gray-500 line-clamp-3">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;
