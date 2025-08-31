
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "./context/GuestContext";
import { AudioProvider } from "./context/AudioContext";
import { WeddingProvider } from "./context/WeddingContext";
import { PlatformProvider } from "./context/PlatformContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AccessibilityHelper } from "./components/AccessibilityHelper";
import WelcomePage from "./pages/WelcomePage";
import FamiliesPage from "./pages/FamiliesPage";
import JourneyPage from "./pages/JourneyPage";
import CeremoniesPage from "./pages/CeremoniesPage";
import CelebrationPage from "./pages/CelebrationPage";
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
    <ErrorBoundary>
      <AccessibilityHelper>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PlatformProvider>
                <WeddingProvider>
                  <GuestProvider>
                    <AudioProvider isDisabledOnRoutes={["/guest-management"]}>
                      <Routes>
                        {/* New 5-page structure */}
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/families" element={<FamiliesPage />} />
                        <Route path="/journey" element={<JourneyPage />} />
                        <Route path="/ceremonies" element={<CeremoniesPage />} />
                        <Route path="/celebration" element={<CelebrationPage />} />
                        
                        {/* Guest Management */}
                        <Route path="/guest-management" element={<GuestManagement />} />
                        
                        {/* Support for guest-specific routes */}
                        <Route path="/:guestId" element={<WelcomePage />} />
                        <Route path="/families/:guestId" element={<FamiliesPage />} />
                        <Route path="/journey/:guestId" element={<JourneyPage />} />
                        <Route path="/ceremonies/:guestId" element={<CeremoniesPage />} />
                        <Route path="/celebration/:guestId" element={<CelebrationPage />} />
                        
                        {/* Legacy routes for backwards compatibility */}
                        <Route path="/invitation" element={<CelebrationPage />} />
                        <Route path="/invitation/:guestId" element={<CelebrationPage />} />
                        
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AudioProvider>
                  </GuestProvider>
                </WeddingProvider>
              </PlatformProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AccessibilityHelper>
    </ErrorBoundary>
  );
};

export default App;
