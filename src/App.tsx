
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "./context/GuestContext";
import { AudioProvider } from "./context/AudioContext";
import { WeddingProvider } from "./context/WeddingContext";
import Index from "./pages/Index";
import Invitation from "./pages/Invitation";
import GuestManagement from "./pages/GuestManagement";
import NotFound from "./pages/NotFound";
import "./components/custom-styles.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  // Add Hindi fonts
  useEffect(() => {
    // Add Poppins font
    const poppinsLink = document.createElement('link');
    poppinsLink.rel = 'stylesheet';
    poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(poppinsLink);
    
    // Add Devanagari fonts for Hindi text with better weights
    const devanagariLink = document.createElement('link');
    devanagariLink.rel = 'stylesheet';
    devanagariLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Hind:wght@400;500;600;700&family=Rozha+One&display=swap';
    document.head.appendChild(devanagariLink);
    
    return () => {
      document.head.removeChild(poppinsLink);
      document.head.removeChild(devanagariLink);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WeddingProvider>
            <GuestProvider>
              <AudioProvider isDisabledOnRoutes={["/guest-management"]}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/invitation" element={<Invitation />} />
                  <Route path="/guest-management" element={<GuestManagement />} />
                  {/* Support for guest-specific routes */}
                  <Route path="/:guestId" element={<Index />} />
                  <Route path="/invitation/:guestId" element={<Invitation />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AudioProvider>
            </GuestProvider>
          </WeddingProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
