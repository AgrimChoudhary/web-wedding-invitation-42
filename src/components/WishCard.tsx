import React from 'react';
import { Heart, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Wish } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import { formatDistanceToNow } from 'date-fns';

interface WishCardProps {
  wish: Wish;
  onLike?: (wishId: string) => void;
  onReply?: (wishId: string) => void;
  compact?: boolean;
}

const WishCard: React.FC<WishCardProps> = ({ 
  wish, 
  onLike, 
  onReply, 
  compact = false 
}) => {
  const { guestId, guestName } = useGuest();

  const handleLike = () => {
    if (guestId && guestName && onLike) {
      onLike(wish.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(wish.id);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white/98 via-wedding-cream/95 to-wedding-blush/30 border-4 border-wedding-gold/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.03] h-72 md:h-80 backdrop-blur-sm rounded-2xl">
      {/* Luxury double border effect */}
      <div className="absolute inset-2 border-2 border-wedding-gold/20 rounded-xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-wedding-gold/30 via-transparent to-wedding-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Corner decorative sparkle */}
      <div className="absolute top-3 right-3 text-wedding-gold/40 group-hover:text-wedding-gold/70 transition-colors duration-300">
        <Sparkles size={16} className="md:w-5 md:h-5 animate-pulse" />
      </div>
      
      {/* Golden accent corners */}
      <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-4 border-l-4 border-wedding-deep-gold/60 rounded-tl-2xl"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-4 border-r-4 border-wedding-deep-gold/60 rounded-br-2xl"></div>
      
      <CardContent className="h-full flex flex-col items-center text-center relative z-10 p-4 md:p-6">
        {/* Top Center - Avatar/Logo */}
        <div className="mb-3 md:mb-4 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-wedding-gold/20 to-wedding-deep-gold/20 animate-pulse"></div>
          <Avatar className="w-12 h-12 md:w-16 md:h-16 border-4 border-wedding-gold/50 shadow-xl relative z-10 ring-2 ring-white/50">
            {wish.image_url ? (
              <AvatarImage src={wish.image_url} alt={wish.guest_name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-wedding-gold/50 to-wedding-deep-gold/40 text-wedding-maroon text-lg md:text-xl font-bold">
                {wish.guest_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-wedding-blush rounded-full p-1">
            <Heart size={12} className="text-wedding-maroon" fill="#AD1457" />
          </div>
        </div>
        
        {/* Name and Time */}
        <div className="mb-3 md:mb-4">
          <h3 className="font-medium text-wedding-maroon text-base md:text-lg mb-1 font-playfair">
            {wish.guest_name}
          </h3>
          <div className="flex items-center justify-center text-wedding-gold/70 text-xs md:text-sm">
            <Clock size={10} className="md:w-3 md:h-3 mr-1" />
            {formatDistanceToNow(new Date(wish.created_at), { addSuffix: true })}
          </div>
        </div>

        {/* Wish Content */}
        <div className="flex-1 flex items-center justify-center mb-3 md:mb-4 px-2">
          <div className="relative">
            <div className="absolute -top-2 -left-2 text-wedding-gold/30 text-2xl md:text-3xl font-serif">"</div>
            <p className="text-gray-700 leading-relaxed font-poppins italic text-xs md:text-sm line-clamp-4 text-center relative z-10">
              {wish.content}
            </p>
            <div className="absolute -bottom-2 -right-2 text-wedding-gold/30 text-2xl md:text-3xl font-serif rotate-180">"</div>
          </div>
        </div>

        {/* Bottom Actions with luxury styling */}
        <div className="w-full flex items-center justify-between pt-3 border-t-2 border-gradient-to-r from-wedding-gold/30 via-wedding-gold/20 to-wedding-gold/30">
          {/* Bottom Left - Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="px-2 md:px-3 text-gray-600 hover:text-red-500 hover:bg-red-50/80 transition-all duration-300 h-7 md:h-8 rounded-full group/like border-2 border-transparent hover:border-red-200/50"
          >
            <Heart 
              size={14} 
              className={`md:w-4 md:h-4 mr-1 md:mr-2 transition-all duration-300 ${
                wish.hasLiked 
                  ? 'fill-red-500 text-red-500 animate-pulse' 
                  : 'group-hover/like:scale-110'
              }`}
            />
            <span className="text-xs md:text-sm font-medium">
              {wish.likes_count}
            </span>
          </Button>

          {/* Bottom Right - Comment Button */}
          {onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="px-2 md:px-3 text-gray-600 hover:text-wedding-maroon hover:bg-wedding-cream/80 transition-all duration-300 h-7 md:h-8 rounded-full group/reply border-2 border-transparent hover:border-wedding-gold/30"
            >
              <MessageCircle 
                size={14} 
                className="md:w-4 md:h-4 mr-1 md:mr-2 group-hover/reply:scale-110 transition-transform duration-300" 
              />
              <span className="text-xs md:text-sm font-medium">
                {wish.replies_count}
              </span>
            </Button>
          )}
        </div>
      </CardContent>

      {/* Subtle luxury gradient overlay with shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-wedding-gold/8 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </Card>
  );
};

export default WishCard;