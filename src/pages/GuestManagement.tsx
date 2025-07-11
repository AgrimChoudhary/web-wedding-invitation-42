import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Heart, User, Copy, Edit, Trash, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { FloatingPetals } from '@/components/AnimatedElements';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { GuestForm } from '@/components/GuestForm';
import { TemplateSelector } from '@/components/TemplateSelector';
import WishManagement from '@/components/WishManagement';
import { useWedding } from '@/context/WeddingContext';
import { formatWeddingDate } from '@/placeholders';

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status?: 'viewed' | 'accepted' | 'declined' | null;
  created_at?: string;
  updated_at?: string;
}

// Security: Define trusted origins
const TRUSTED_ORIGINS = [
  'https://utsavy-invitations.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080'
];

const isTrustedOrigin = (origin: string): boolean => {
  return TRUSTED_ORIGINS.includes(origin) || origin === window.location.origin;
};

const GuestManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null);
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { weddingData } = useWedding();
  
  // Generate default message template based on wedding data
  const generateDefaultMessageTemplate = () => {
    return `Dear {guest-name},\n\nYou are cordially invited to the wedding ceremony of ${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName} on ${formatWeddingDate(weddingData.mainWedding.date)}.\n\nClick here to view your personalized invitation: {unique-link}\n\nWe look forward to celebrating our special day with you!`;
  };
  
  // Generate message templates based on wedding data
  const generateMessageTemplates = () => {
    return [
      {
        name: "Formal Invitation",
        template: `Dear {guest-name},\n\nWe are delighted to invite you to the wedding ceremony of ${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName} on ${formatWeddingDate(weddingData.mainWedding.date)}.\n\nPlease find your personalized invitation here: {unique-link}\n\nYour presence would make our special day complete.\n\nWarm regards,\n${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName}`
      },
      {
        name: "Casual & Friendly",
        template: `Hey {guest-name}! 🎉\n\nWe're tying the knot! You're invited to our wedding celebration on ${formatWeddingDate(weddingData.mainWedding.date)}.\n\nCheck out your personal invitation: {unique-link}\n\nCan't wait to celebrate with you!\n\n${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName}`
      },
      {
        name: "Short & Sweet",
        template: `Hi {guest-name},\n\nYou're invited! ${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName} are getting married on ${formatWeddingDate(weddingData.mainWedding.date)}.\n\nYour invitation: {unique-link}`
      },
      {
        name: "Elegant Request",
        template: `Dear {guest-name},\n\nThe honor of your presence is requested at the marriage of ${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName} on ${formatWeddingDate(weddingData.mainWedding.date)}.\n\nKindly view your invitation: {unique-link}\n\nWe would be delighted by your attendance.`
      },
      {
        name: "Family Focused",
        template: `Dear {guest-name},\n\nWith great joy, our families invite you to share in our happiness as we unite in marriage on ${formatWeddingDate(weddingData.mainWedding.date)}.\n\nYour personal invitation awaits: {unique-link}\n\nWith love,\n${weddingData.couple.groomFirstName} & ${weddingData.couple.brideFirstName} and Families`
      }
    ];
  };
  
  // Set up message listener for platform communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check
      if (!isTrustedOrigin(event.origin)) {
        console.warn('Untrusted origin se message mila:', event.origin);
        return;
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'INITIAL_GUESTS_DATA':
          console.log('Received initial guests data:', payload);
          if (payload.guests && Array.isArray(payload.guests)) {
            setGuests(payload.guests);
          }
          setIsLoading(false);
          break;
        case 'GUEST_ADDED':
          console.log('Guest added:', payload);
          setGuests(prev => [payload.guest, ...prev]);
          toast({
            title: "Success",
            description: "Guest added successfully",
            variant: "default",
          });
          break;
        case 'GUEST_UPDATED':
          console.log('Guest updated:', payload);
          setGuests(prev => prev.map(guest => 
            guest.id === payload.guest.id ? payload.guest : guest
          ));
          toast({
            title: "Success",
            description: "Guest updated successfully",
            variant: "default",
          });
          break;
        case 'GUEST_DELETED':
          console.log('Guest deleted:', payload);
          setGuests(prev => prev.filter(guest => guest.id !== payload.guestId));
          toast({
            title: "Guest removed",
            variant: "default",
          });
          break;
        case 'ERROR':
          console.error('Error from platform:', payload);
          toast({
            title: "Error",
            description: payload.message || "An error occurred",
            variant: "destructive",
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Request initial guests data from platform
    setIsLoading(true);
    window.parent.postMessage({
      type: 'REQUEST_INITIAL_GUESTS_DATA',
      payload: {}
    }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // Load saved message template
  useEffect(() => {
    // Load saved message template from localStorage if it exists
    const savedTemplate = localStorage.getItem('whatsappMessageTemplate');
    if (savedTemplate) {
      setMessageTemplate(savedTemplate);
    } else {
      // Set default template if none exists
      const defaultTemplate = generateDefaultMessageTemplate();
      setMessageTemplate(defaultTemplate);
    }
  }, []);
  
  const fetchGuests = () => {
    setIsLoading(true);
    window.parent.postMessage({
      type: 'REQUEST_INITIAL_GUESTS_DATA',
      payload: {}
    }, '*');
  };
  
  const confirmDeleteGuest = (guest: Guest) => {
    setGuestToDelete(guest);
  };
  
  const deleteGuest = async () => {
    if (!guestToDelete) return;
    
    try {
      // Send message to parent platform
      window.parent.postMessage({
        type: 'DELETE_GUEST',
        payload: {
          guestId: guestToDelete.id
        }
      }, '*');
      
      // Optimistic update
      setGuests(guests.filter(guest => guest.id !== guestToDelete.id));
      setGuestToDelete(null);
      
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: "Failed to remove guest",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (guest: Guest) => {
    setGuestToEdit(guest);
    setEditName(guest.name);
    setEditMobile(guest.mobile);
    setIsEditDialogOpen(true);
  };
  
  const saveGuestEdit = async () => {
    if (!guestToEdit) return;
    
    try {
      // Send message to parent platform
      window.parent.postMessage({
        type: 'UPDATE_GUEST',
        payload: {
          guestId: guestToEdit.id,
          name: editName,
          mobile: editMobile
        }
      }, '*');
      
      // Optimistic update
      setGuests(guests.map(guest => 
        guest.id === guestToEdit.id 
          ? { ...guest, name: editName, mobile: editMobile } 
          : guest
      ));
      
      setIsEditDialogOpen(false);
      
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest",
        variant: "destructive",
      });
    }
  };
  
  const getGuestLink = (guestId: string) => {
    // Get the base URL of the site
    const baseUrl = window.location.origin;
    // Create the guest-specific link
    return `${baseUrl}/${guestId}`;
  };

  const copyGuestLink = (guestId: string) => {
    // Get the welcome link
    const welcomeLink = getGuestLink(guestId);
    
    // Copy to clipboard
    navigator.clipboard.writeText(welcomeLink)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Guest invitation link has been copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Error copying text: ', err);
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        });
      });
  };

  const shareOnWhatsApp = (guest: Guest) => {
    const welcomeLink = getGuestLink(guest.id);
    
    // Replace template variables with actual values
    let personalizedMessage = messageTemplate
      .replace(/{guest-name}/g, guest.name)
      .replace(/{unique-link}/g, welcomeLink);
    
    // Encode for URL
    const message = encodeURIComponent(personalizedMessage);
    
    // Format the phone number (remove any non-digits)
    let phoneNumber = guest.mobile.replace(/\D/g, "");
    // If it doesn't start with a country code, add India's country code
    if (!phoneNumber.startsWith("+") && !phoneNumber.startsWith("00")) {
      phoneNumber = "91" + phoneNumber;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const insertPlaceholder = (placeholder: string) => {
    setMessageTemplate(prev => {
      const textArea = document.getElementById('messageTemplate') as HTMLTextAreaElement;
      if (textArea) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        
        const text = prev;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        
        textArea.focus();
        return before + placeholder + after;
      }
      return prev + placeholder;
    });
  };

  const selectTemplate = (template: string, name: string) => {
    setMessageTemplate(template);
    setSelectedTemplate(name);
  };

  const saveMessageTemplate = () => {
    localStorage.setItem('whatsappMessageTemplate', messageTemplate);
    setIsSettingsOpen(false);
    toast({
      title: "Success",
      description: "Message template saved successfully",
      variant: "default",
    });
  };

  const resetMessageTemplate = () => {
    const defaultTemplate = generateDefaultMessageTemplate();
    setMessageTemplate(defaultTemplate);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen pattern-background">
      <FloatingPetals />
      
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="font-great-vibes text-3xl sm:text-4xl text-wedding-maroon mb-2">Wedding Management</h1>
            <p className="text-gray-600">Manage your guests and wedding wishes</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream w-full sm:w-auto"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={16} className="mr-2 text-wedding-gold" />
              Message Settings
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="guests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-wedding-cream/50">
            <TabsTrigger value="guests" className="data-[state=active]:bg-white data-[state=active]:text-wedding-maroon">
              <User size={16} className="mr-2" />
              Guest Management
            </TabsTrigger>
            <TabsTrigger value="wishes" className="data-[state=active]:bg-white data-[state=active]:text-wedding-maroon">
              <Heart size={16} className="mr-2" />
              Wish Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guests" className="space-y-8">
            <div className="glass-card mb-8 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-wedding-gold/50 rounded-tl-lg"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-wedding-gold/50 rounded-tr-lg"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-wedding-gold/50 rounded-bl-lg"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-wedding-gold/50 rounded-br-lg"></div>
              
              <GuestForm onSuccess={fetchGuests} />
            </div>
            
            <div className="glass-card">
              <div className="p-3 sm:p-6">
                <h2 className="font-playfair text-xl text-wedding-maroon mb-4 text-center">
                  <User size={18} className="inline-block mr-2 text-wedding-gold" />
                  Guest List
                </h2>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="loading-spinner mb-4"></div>
                    <p className="text-wedding-maroon font-dancing-script text-xl ml-3">Loading guests...</p>
                  </div>
                ) : guests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User size={48} className="mx-auto mb-2 opacity-30" />
                    <p>No guests added yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="min-w-full">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-wedding-gold/20">
                            <TableHead className="text-wedding-maroon font-medium text-xs sm:text-sm min-w-[120px]">Guest Name</TableHead>
                            <TableHead className="text-wedding-maroon font-medium text-xs sm:text-sm min-w-[100px]">Mobile</TableHead>
                            <TableHead className="text-wedding-maroon font-medium text-xs sm:text-sm min-w-[80px]">Status</TableHead>
                            <TableHead className="text-right text-wedding-maroon font-medium text-xs sm:text-sm min-w-[140px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guests.map((guest) => (
                            <TableRow key={guest.id} className="hover:bg-wedding-cream/30 transition-colors border-wedding-gold/10">
                              <TableCell className="font-medium text-xs sm:text-sm py-3 sm:py-4">
                                <div className="truncate max-w-[100px] sm:max-w-none" title={guest.name}>
                                  {guest.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm py-3 sm:py-4">
                                <div className="truncate max-w-[80px] sm:max-w-none" title={guest.mobile}>
                                  {guest.mobile}
                                </div>
                              </TableCell>
                              <TableCell className="py-3 sm:py-4">
                                {guest.status && (
                                  <Badge variant="outline" className={`
                                    text-xs px-1.5 py-0.5 sm:px-2 sm:py-1
                                    ${guest.status === 'viewed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                      guest.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                      'bg-red-50 text-red-700 border-red-200'}
                                  `}>
                                    {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right py-3 sm:py-4">
                                <div className="flex justify-end gap-1 sm:gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 border-wedding-gold/20 text-wedding-maroon hover:bg-wedding-cream"
                                          onClick={() => copyGuestLink(guest.id)}
                                        >
                                          <Copy size={12} className="sm:hidden" />
                                          <Copy size={14} className="hidden sm:block" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Copy invitation link</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 border-wedding-gold/20 text-green-600 hover:bg-green-50"
                                          onClick={() => shareOnWhatsApp(guest)}
                                        >
                                          <Share2 size={12} className="sm:hidden" />
                                          <Share2 size={14} className="hidden sm:block" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Share on WhatsApp</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 border-wedding-gold/20 text-blue-600 hover:bg-blue-50"
                                          onClick={() => openEditDialog(guest)}
                                        >
                                          <Edit size={12} className="sm:hidden" />
                                          <Edit size={14} className="hidden sm:block" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Edit guest</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="h-6 w-6 sm:h-8 sm:w-8 p-0 border-wedding-gold/20 text-wedding-maroon hover:bg-red-50"
                                          onClick={() => confirmDeleteGuest(guest)}
                                        >
                                          <Trash size={12} className="sm:hidden" />
                                          <Trash size={14} className="hidden sm:block" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete guest</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishes">
            <div className="glass-card">
              <div className="p-6">
                <WishManagement />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium text-wedding-maroon">{guestToDelete?.name}</span> from your guest list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteGuest}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Guest Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-wedding-maroon">Edit Guest</DialogTitle>
            <DialogDescription>
              Update the guest information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="editName">Name</Label>
              <Input 
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMobile">Mobile Number</Label>
              <Input 
                id="editMobile"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
                className="border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveGuestEdit}
              className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog - Improved Mobile Friendly */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-white max-w-xl overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-wedding-maroon">WhatsApp Message Settings</DialogTitle>
            <DialogDescription>
              Customize the message that will be sent to guests via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[calc(80vh-200px)] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="messageTemplate">Message Template</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline" 
                  className="h-8 text-xs border-wedding-gold/30 text-wedding-maroon"
                  onClick={() => insertPlaceholder('{guest-name}')}
                >
                  Insert Guest Name
                </Button>
                <Button 
                  type="button" 
                  size="sm"
                  variant="outline" 
                  className="h-8 text-xs border-wedding-gold/30 text-wedding-maroon"
                  onClick={() => insertPlaceholder('{unique-link}')}
                >
                  Insert Unique Link
                </Button>
              </div>
              
              <Textarea 
                id="messageTemplate"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="min-h-[150px] border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
                placeholder="Type your message here..."
              />
              
              <div className="text-sm text-gray-500 flex items-center gap-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Use <span className="font-mono text-xs bg-gray-100 p-0.5 rounded">{"{guest-name}"}</span> and <span className="font-mono text-xs bg-gray-100 p-0.5 rounded">{"{unique-link}"}</span> in your message.
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Message Templates</Label>
              <TemplateSelector 
                templates={generateMessageTemplates()}
                selectedTemplate={selectedTemplate}
                onSelect={selectTemplate}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <div className="flex w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={resetMessageTemplate}
                className="border-wedding-gold/30 text-wedding-maroon hover:bg-wedding-cream w-full sm:w-auto"
              >
                Reset to Default
              </Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 sm:flex-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveMessageTemplate}
                className="bg-wedding-gold hover:bg-wedding-deep-gold text-white flex-1 sm:flex-auto"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestManagement;