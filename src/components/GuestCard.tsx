
import React from 'react';
import { Phone, Copy, Edit, Trash, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status?: string | null;
}

interface GuestCardProps {
  guest: Guest;
  onCopy: (id: string) => void;
  onShare: (guest: Guest) => void; 
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({ 
  guest, 
  onCopy, 
  onShare, 
  onEdit, 
  onDelete 
}) => {
  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'viewed':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Viewed
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-wedding-gold/20 rounded-lg overflow-hidden bg-white/95 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center p-3 border-b border-wedding-gold/10 bg-wedding-cream/30">
        <div className="flex flex-col">
          <h3 className="font-medium text-wedding-maroon truncate">{guest.name}</h3>
          {getStatusBadge(guest.status)}
        </div>
        <Button 
          onClick={() => onEdit(guest)} 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
        >
          <Edit size={16} className="text-blue-600" />
        </Button>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4 text-sm flex items-center">
          <Phone size={14} className="mr-2 text-wedding-gold" />
          {guest.mobile}
        </p>
        
        <div className="grid grid-cols-3 gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 border-wedding-gold/20 text-wedding-maroon hover:bg-wedding-cream"
            onClick={() => onCopy(guest.id)}
            title="Copy"
          >
            <Copy size={16} />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 border-wedding-gold/20 text-green-600 hover:bg-green-50"
            onClick={() => onShare(guest)}
            title="Share"
          >
            <Share2 size={16} />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 border-wedding-gold/20 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(guest)}
            title="Delete"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
