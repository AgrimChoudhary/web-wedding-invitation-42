import React, { useState } from 'react';
import { Heart, Sparkles, Users, Feather, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishes } from '@/hooks/useWishes';
import { useGuest } from '@/context/GuestContext';
import WishCard from './WishCard';
import WishComposerModal from './WishComposerModal';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface WishesCarouselProps {
  onViewAll?: () => void;
}

const WishesCarousel: React.FC<WishesCarouselProps> = ({ onViewAll }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const { wishes, isLoading, isSubmitting, submitWish, toggleLike } = useWishes();
  const { guestId, guestName } = useGuest();

  const handleSubmitWish = async (content: string, imageFile?: File) => {
    if (!guestId || !guestName) {
      console.error('Missing guest info:', { guestId, guestName });
      return false;
    }

    console.log('Submitting wish with image:', { content, hasImage: !!imageFile, guestId, guestName });
    const success = await submitWish(content, guestId, guestName, imageFile);
    return success;
  };

  const handleLike = (wishId: string) => {
    if (!guestId || !guestName) {
      console.error('Cannot like - missing guest info:', { guestId, guestName });
      return;
    }
    console.log('Liking wish:', wishId, 'by:', guestName);
    toggleLike(wishId, guestId, guestName);
  };

  return (
    <div className="py-8 md:py-12 w-full bg-gradient-to-br from-wedding-cream/40 via-white/60 to-wedding-blush/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10 md:opacity-20">
        <div className="absolute top-4 md:top-8 left-4 md:left-8 text-wedding-gold/30">
          <Heart size={20} className="md:w-8 md:h-8 animate-pulse" />
        </div>
        <div className="absolute top-6 md:top-12 right-6 md:right-12 text-wedding-blush/40">
          <Sparkles size={18} className="md:w-7 md:h-7 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 text-wedding-gold/30">
          <Users size={16} className="md:w-6 md:h-6 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 text-wedding-maroon/20">
          <Feather size={18} className="md:w-6 md:h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact Header for Mobile */}
        <div className="text-center mb-6 md:mb-8">
          <div className="relative inline-block">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-playfair text-wedding-maroon mb-2 md:mb-3 relative">
              Wedding Wishes
              <div className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-wedding-gold via-wedding-deep-gold to-wedding-gold rounded-full"></div>
            </h2>
          </div>
          <p className="text-xs md:text-base text-wedding-gold/80 mt-2 md:mt-4 font-poppins max-w-md md:max-w-xl mx-auto leading-relaxed px-4">
            Share your heartfelt blessings
          </p>
          
          {wishes.length > 0 && (
            <div className="flex items-center justify-center mt-2 md:mt-3 space-x-2">
              <Heart size={12} className="md:w-4 md:h-4 text-wedding-blush fill-wedding-blush animate-pulse" />
              <span className="text-xs md:text-sm text-wedding-maroon font-medium">
                {wishes.length} beautiful {wishes.length === 1 ? 'wish' : 'wishes'} shared
              </span>
              <Heart size={12} className="md:w-4 md:h-4 text-wedding-blush fill-wedding-blush animate-pulse" />
            </div>
          )}
        </div>

        {/* Wishes Carousel */}
        {isLoading ? (
          <div className="mb-8 md:mb-12">
            <div className="flex space-x-4 md:space-x-6 overflow-hidden justify-center">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="min-w-[280px] md:min-w-[300px] h-72 md:h-80 p-4 md:p-6 bg-white/60 border-2 border-wedding-gold/20 shadow-xl">
                  <div className="flex flex-col items-center space-y-3 md:space-y-4">
                    <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                    <div className="space-y-2 text-center">
                      <Skeleton className="h-4 md:h-5 w-24 md:w-32" />
                      <Skeleton className="h-3 md:h-4 w-16 md:w-24" />
                    </div>
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-3 md:h-4 w-full" />
                      <Skeleton className="h-3 md:h-4 w-5/6 mx-auto" />
                      <Skeleton className="h-3 md:h-4 w-4/5 mx-auto" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (() => {
            const approvedWishes = wishes.filter(wish => wish.is_approved);
            console.log('🎠 WishesCarousel: Filtering wishes');
            console.log('🎠 WishesCarousel: Total wishes:', wishes?.length || 0);
            console.log('🎠 WishesCarousel: Approved wishes:', approvedWishes?.length || 0);
            console.log('🎠 WishesCarousel: Approved wishes data:', approvedWishes);
            
            return approvedWishes.length > 0;
          })() ? (
          <div className="mb-8 md:mb-12 relative">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-4xl md:max-w-5xl mx-auto"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {wishes.filter(wish => wish.is_approved).map((wish, index) => {
                  console.log('🎠 WishesCarousel: Rendering wish', index + 1, ':', {
                    id: wish.id,
                    guest_name: wish.guest_name,
                    content: wish.content,
                    is_approved: wish.is_approved
                  });
                  return (
                  <CarouselItem key={wish.id} className="pl-4 md:pl-6 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3">
                    <div 
                      className="animate-fade-in h-full"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <WishCard 
                        wish={wish}
                        onLike={handleLike}
                      />
                    </div>
                  </CarouselItem>
                  );
                })}
              </CarouselContent>
              
              {/* Enhanced Mobile-Friendly Navigation Buttons */}
              <CarouselPrevious className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-wedding-gold/90 to-wedding-deep-gold/90 border-2 border-wedding-gold/50 hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-10">
                <ChevronLeft size={16} className="md:w-5 md:h-5" />
              </CarouselPrevious>
              <CarouselNext className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-wedding-gold/90 to-wedding-deep-gold/90 border-2 border-wedding-gold/50 hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-10">
                <ChevronRight size={16} className="md:w-5 md:h-5" />
              </CarouselNext>
            </Carousel>

            {(() => {
              const approvedCount = wishes.filter(wish => wish.is_approved).length;
              console.log('🎠 WishesCarousel: Show "View All" button?', {
                approvedCount,
                shouldShow: approvedCount > 5 && !!onViewAll
              });
              return approvedCount > 5 && onViewAll;
            })() && (
              <div className="text-center mt-4 md:mt-6">
                <button
                  onClick={onViewAll}
                  className="inline-flex items-center space-x-2 text-wedding-maroon hover:text-wedding-gold transition-all duration-300 font-medium font-poppins hover:scale-105 bg-white/60 px-3 py-2 md:px-4 md:py-2 rounded-full shadow-lg hover:shadow-xl backdrop-blur-sm text-sm md:text-base"
                >
                  <span>View all {wishes.length} wishes</span>
                  <Heart size={14} className="md:w-4 md:h-4 animate-pulse" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 md:mb-12 flex justify-center px-4">
            {console.log('🎠 WishesCarousel: Showing "No Approved Wishes" state')}
            {console.log('🎠 WishesCarousel: Debug - wishes data:', {
              totalWishes: wishes?.length || 0,
              approvedWishes: wishes?.filter(w => w.is_approved)?.length || 0,
              isLoading,
              allWishes: wishes
            })}
            <Card className="max-w-sm md:max-w-lg h-48 md:h-56 flex flex-col items-center justify-center text-center p-4 md:p-6 bg-gradient-to-br from-wedding-cream/90 via-white/95 to-wedding-blush/20 border-2 border-wedding-gold/30 shadow-2xl">
              <div className="p-3 md:p-4 rounded-full bg-wedding-gold/20 mb-3 md:mb-4 border-2 border-wedding-gold/30 shadow-lg">
                <Sparkles size={20} className="md:w-6 md:h-6 text-wedding-gold animate-pulse" />
              </div>
              <h3 className="text-base md:text-lg font-playfair text-wedding-maroon mb-2">
                {wishes?.length > 0 ? "Wishes Pending Approval" : "Be the First to Share Your Blessing"}
              </h3>
              <p className="text-gray-600 font-poppins text-xs md:text-sm max-w-xs leading-relaxed">
                {wishes?.length > 0 
                  ? `${wishes.length} wishes are waiting for host approval` 
                  : "Your beautiful words will start this wonderful celebration!"
                }
              </p>
              <div className="mt-2 text-xs text-gray-400">
                Debug: {wishes?.length || 0} total, {wishes?.filter(w => w.is_approved)?.length || 0} approved
              </div>
            </Card>
          </div>
        )}

        {/* Post Your Wish Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsComposerOpen(true)}
            className="group bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full font-poppins font-semibold"
          >
            <Plus size={16} className="md:w-5 md:h-5 mr-2 md:mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Post Your Wish
          </Button>
        </div>

        {/* Wish Composer Modal */}
        <WishComposerModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          onSubmit={handleSubmitWish}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default WishesCarousel;