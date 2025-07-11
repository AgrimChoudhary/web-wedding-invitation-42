import React, { useState, useRef } from 'react';
import { Send, Upload, X, Heart, Feather, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGuest } from '@/context/GuestContext';

interface WishComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, imageFile?: File) => Promise<boolean>;
  isSubmitting?: boolean;
}

const WishComposerModal: React.FC<WishComposerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [wishText, setWishText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { guestName } = useGuest();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Only image files are allowed");
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!wishText.trim()) return;

    const success = await onSubmit(wishText, selectedImage || undefined);
    if (success) {
      setWishText('');
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
    }
  };

  const handleClose = () => {
    setWishText('');
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm md:max-w-md mx-auto bg-gradient-to-br from-white/98 via-wedding-cream/95 to-wedding-blush/30 border-4 border-wedding-gold/50 shadow-2xl backdrop-blur-sm rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Luxury border effect */}
        <div className="absolute inset-2 border-2 border-wedding-gold/20 rounded-xl pointer-events-none"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-xl md:text-2xl font-playfair text-wedding-maroon text-center mb-1 md:mb-2">
            Share Your Blessing
          </DialogTitle>
          <p className="text-wedding-gold/70 font-poppins text-center text-xs md:text-sm">
            Leave a heartfelt wish for the happy couple
          </p>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 relative z-10">
          {/* Guest Avatar Section */}
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-wedding-gold/30 ring-2 ring-white/50">
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt="Your photo" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-wedding-gold/40 to-wedding-deep-gold/30 text-wedding-maroon font-bold text-sm md:text-base">
                  {guestName?.charAt(0).toUpperCase() || 'G'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-wedding-maroon text-sm md:text-base">{guestName || 'Guest'}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-wedding-gold hover:text-wedding-maroon transition-colors p-0 h-auto font-normal"
              >
                <Image size={10} className="md:w-3 md:h-3 mr-1" />
                {selectedImage ? 'Change photo' : 'Add photo (optional)'}
              </Button>
            </div>
            {selectedImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="p-1 h-auto text-gray-500 hover:text-red-500"
              >
                <X size={14} className="md:w-4 md:h-4" />
              </Button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Wish Text Area */}
          <div className="relative">
            <Textarea
              placeholder="Share your heartfelt wishes, blessings, and beautiful thoughts for the couple's journey together..."
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              maxLength={280}
              className="resize-none border-3 border-wedding-gold/40 focus:border-wedding-gold bg-white/95 text-sm font-poppins leading-relaxed p-3 md:p-4 rounded-xl shadow-inner min-h-[100px] md:min-h-[120px]"
              rows={4}
            />
            <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 text-xs text-gray-500">
              {wishText.length}/280
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-3 md:pt-4 border-t-2 border-wedding-gold/20">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 font-poppins text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!wishText.trim() || isSubmitting || wishText.length > 280}
              className="bg-gradient-to-r from-wedding-gold to-wedding-deep-gold hover:from-wedding-deep-gold hover:to-wedding-gold text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 font-poppins font-medium text-sm md:text-base px-4 md:px-6 py-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Send size={12} className="md:w-4 md:h-4 mr-2" />
                  <span>Share Wish</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-3 right-3 text-wedding-gold/30">
          <Heart size={14} className="md:w-4 md:h-4 animate-pulse" />
        </div>
        <div className="absolute bottom-3 left-3 text-wedding-blush/40">
          <Feather size={12} className="md:w-4 md:h-4 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse opacity-30 pointer-events-none"></div>
      </DialogContent>
    </Dialog>
  );
};

export default WishComposerModal;