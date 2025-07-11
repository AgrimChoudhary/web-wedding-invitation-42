import React, { useState } from 'react';
import { User, Phone, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface GuestFormProps {
  onSuccess: () => void;
}

export const GuestForm: React.FC<GuestFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !mobile.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and mobile number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send message to parent platform
      window.parent.postMessage({
        type: 'ADD_GUEST',
        payload: {
          name: name.trim(),
          mobile: mobile.trim()
        }
      }, '*');
      
      // Reset the form (actual success will be handled by the message listener)
      setName('');
      setMobile('');
      
      // Refresh guest list
      onSuccess();
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="font-playfair text-xl text-wedding-maroon mb-4 text-center">
        <Plus size={18} className="inline-block mr-2 text-wedding-gold" />
        Add New Guest
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <User size={18} className="text-wedding-gold flex-shrink-0" />
          <Input
            placeholder="Guest Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Phone size={18} className="text-wedding-gold flex-shrink-0" />
          <Input
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Add Guest
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default GuestForm;