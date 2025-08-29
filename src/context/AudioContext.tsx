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
  const [audio] = useState(() => {
    const audioElement = new Audio("/audio/Kudmayi.mp3");
    audioElement.loop = true;
    audioElement.volume = 0.5;
    audioElement.preload = "auto";
    return audioElement;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();
  
  const isMusicDisabled = isDisabledOnRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  // Sync state with actual audio playback
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  // Initialize audio with user interaction
  useEffect(() => {
    if (isInitialized || isMusicDisabled) return;

    const handleUserInteraction = async () => {
      try {
        await audio.play();
        setIsInitialized(true);
      } catch (error) {
        console.log("Audio playback failed:", error);
        setIsInitialized(true); // Mark as initialized even if failed
      }
    };

    // Try autoplay first (might fail due to browser policies)
    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsInitialized(true);
      } catch (error) {
        // Autoplay failed, wait for user interaction
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
        document.addEventListener('keydown', handleUserInteraction, { once: true });
      }
    };

    tryAutoplay();

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audio, isInitialized, isMusicDisabled]);

  // Handle route-based music control
  useEffect(() => {
    if (isMusicDisabled && !audio.paused) {
      audio.pause();
    } else if (!isMusicDisabled && isInitialized && audio.paused) {
      audio.play().catch(console.error);
    }
  }, [location.pathname, isMusicDisabled, isInitialized, audio]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized && !isMusicDisabled && audio.paused) {
        audio.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [audio, isInitialized, isMusicDisabled]);

  const toggleMusic = async () => {
    if (isMusicDisabled || !isInitialized) return;
    
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
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
