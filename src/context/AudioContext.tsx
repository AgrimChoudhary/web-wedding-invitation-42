import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AudioContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

interface AudioProviderProps {
  children: ReactNode;
  isDisabledOnRoutes?: string[];
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
});

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, isDisabledOnRoutes = [] }) => {
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();
  
  const isMusicDisabled = isDisabledOnRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Set up audio on mount
  useEffect(() => {
    audio.src = "/audio/Kudmayi.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    
    const playAudio = async () => {
      if (!isInitialized && !isMusicDisabled) {
        try {
          // Set audio properties for autoplay
          audio.muted = false;
          audio.autoplay = true;
          
          // Try to play
          await audio.play();
          setIsPlaying(true);
          setIsInitialized(true);
        } catch (error) {
          console.log("Initial autoplay failed:", error);
        }
      }
    };

    // Try to play immediately
    playAudio();

    // Add event listeners for user interaction
    const handleUserInteraction = async () => {
      if (!isInitialized && !isMusicDisabled) {
        try {
          await audio.play();
          setIsPlaying(true);
          setIsInitialized(true);
        } catch (error) {
          console.log("Playback failed on user interaction:", error);
        }
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    // Try again after a short delay
    const timeoutId = setTimeout(() => {
      if (!isInitialized && !isMusicDisabled) {
        playAudio();
      }
    }, 1000);

    return () => {
      audio.pause();
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isInitialized, isMusicDisabled]);

  // Watch for route changes and pause music on disabled routes
  useEffect(() => {
    if (isMusicDisabled) {
      audio.pause();
      setIsPlaying(false);
    } else if (isInitialized && !audio.paused) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [location.pathname, isMusicDisabled]);

  // Try to resume playback when the document becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized && !audio.paused && !isMusicDisabled) {
        audio.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInitialized, audio, isMusicDisabled]);

  const toggleMusic = async () => {
    if (isMusicDisabled) return;
    
    try {
      if (isPlaying) {
        audio.muted = true;
        setIsPlaying(false);
      } else {
        audio.muted = false;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling music:", error);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  return useContext(AudioContext);
};
