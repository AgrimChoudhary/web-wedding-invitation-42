import React, { useState } from 'react';
import { X, Heart, MessageCircle, Send, Sparkles, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWishes } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import WishCard from './WishCard';

interface WishesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WishesModal: React.FC<WishesModalProps> = ({ open, onOpenChange }) => {
  const [replyText, setReplyText] = useState('');
  const [replyingToWishId, setReplyingToWishId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishes, isLoading, toggleLike } = useWishes();
  const { guestId, guestName } = useGuest();

  const handleLike = (wishId: string) => {
    if (guestId && guestName) {
      toggleLike(wishId, guestId, guestName);
    }
  };

  const handleReply = (wishId: string) => {
    setReplyingToWishId(wishId);
  };

  const handleSubmitReply = () => {
    if (!replyingToWishId || !replyText.trim() || !guestId || !guestName) return;
    
    // Send message to parent platform
    window.parent.postMessage({
      type: 'SUBMIT_WISH_REPLY',
      payload: {
        wishId: replyingToWishId,
        guestId: guestId,
        guestName: guestName,
        content: replyText.trim()
      }
    }, '*');
    
    // Clear form
    setReplyText('');
    setReplyingToWishId(null);
  };

  // Filter wishes based on search query and approval status
  const filteredWishes = wishes.filter(wish =>
    wish.is_approved && // Only show approved wishes to guests
    (wish.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
     wish.guest_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] bg-gradient-to-br from-wedding-cream/95 via-white/98 to-wedding-blush/30 border-wedding-gold/30 shadow-2xl">
        <DialogHeader className="relative pb-4 border-b border-wedding-gold/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <DialogTitle className="text-2xl font-playfair text-wedding-maroon">
                  All Wedding Wishes
                </DialogTitle>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-wedding-gold via-wedding-blush to-transparent"></div>
              </div>
              <Sparkles size={20} className="text-wedding-gold/60 animate-pulse" />
            </div>
            <div className="text-sm text-wedding-gold/70 font-poppins">
              {wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} shared
            </div>
          </div>

          {/* Search bar */}
          {wishes.length > 5 && (
            <div className="relative mt-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search wishes by content or guest name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-wedding-gold/30 focus:border-wedding-gold bg-white/80"
              />
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <div className="w-8 h-8 border-2 border-wedding-gold border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 border-2 border-wedding-gold/20 rounded-full animate-pulse"></div>
              </div>
              <p className="mt-4 text-gray-600 font-poppins">Loading all the beautiful wishes...</p>
            </div>
          ) : filteredWishes.length > 0 ? (
            <div className="space-y-6 py-2">
              {filteredWishes.map((wish, index) => (
                <div key={wish.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <WishCard 
                    wish={wish} 
                    onLike={handleLike}
                    onReply={handleReply}
                    compact={false}
                  />
                  
                  {/* Enhanced Reply Section */}
                  {replyingToWishId === wish.id && (
                    <div className="mt-4 ml-6 animate-fade-in">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-wedding-blush/20 to-wedding-gold/20 rounded-lg blur-sm"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm p-4 border border-wedding-gold/30 rounded-lg shadow-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <MessageCircle size={16} className="text-wedding-gold" />
                            <span className="text-sm font-medium text-wedding-maroon">
                              Replying to {wish.guest_name}
                            </span>
                          </div>
                          
                          <Textarea
                            placeholder="Write a thoughtful reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            maxLength={280}
                            className="min-h-[70px] border-wedding-gold/30 focus:border-wedding-gold bg-white/80"
                            rows={3}
                          />
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-wedding-gold/20">
                            <div className="text-xs text-gray-500 flex items-center space-x-2">
                              <span>{replyText.length}/280 characters</span>
                            </div>
                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingToWishId(null);
                                  setReplyText('');
                                }}
                                className="text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleSubmitReply}
                                disabled={!replyText.trim() || replyText.length > 280}
                                className="bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Send size={14} className="mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-wedding-gold/50 mb-4" />
              <h3 className="text-lg font-playfair text-wedding-maroon mb-2">
                No wishes found
              </h3>
              <p className="text-gray-600 font-poppins">
                Try adjusting your search terms or clear the search to see all wishes.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="mt-4 border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative inline-block mb-6">
                <Heart size={64} className="mx-auto text-wedding-gold/50 animate-pulse" />
                <Sparkles size={20} className="absolute -top-2 -right-2 text-wedding-blush/60 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <h3 className="text-xl font-playfair text-wedding-maroon mb-3">
                No wishes yet
              </h3>
              <p className="text-gray-600 font-poppins max-w-md mx-auto">
                Be the first to share your heartfelt wishes for the happy couple! Your words will make their special day even more memorable.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default WishesModal;