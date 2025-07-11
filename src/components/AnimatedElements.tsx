import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface PetalProps {
  key: number;
  style: React.CSSProperties;
}

interface ConfettiProps {
  isActive: boolean;
}

interface FallingHeartsProps {
  isActive: boolean;
}

interface FireworksDisplayProps {
  isActive: boolean;
}

// Create floating petals component - optimized to use fewer elements
export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<PetalProps[]>([]);
  
  useEffect(() => {
    const createPetal = () => {
      const petal: PetalProps = {
        key: Date.now(),
        style: {
          left: `${Math.random() * 100}vw`,
          animationDuration: `${10 + Math.random() * 15}s`,
          opacity: Math.random() * 0.6 + 0.2,
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDelay: `${Math.random() * 5}s`,
        },
      };
      
      setPetals(prev => {
        // Keep total petals limited to improve performance
        const updatedPetals = [...prev, petal];
        return updatedPetals.slice(-12); // Only keep the 12 most recent petals
      });
      
      setTimeout(() => {
        setPetals(prev => prev.filter(p => p.key !== petal.key));
      }, 25000);
    };
    
    // Start with fewer petals for better performance
    for (let i = 0; i < 8; i++) {
      createPetal();
    }
    
    const interval = setInterval(createPetal, 4000); // Slower interval for better performance
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.key}
          className="petal animate-float-petals"
          style={petal.style}
        />
      ))}
    </div>
  );
};

// Create confetti component - optimized for performance
export const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  const [confetti, setConfetti] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  
  useEffect(() => {
    if (isActive) {
      // Reduce number of particles on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 30 : 50;
      
      const newConfetti = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          top: '0',
          backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
          width: `${Math.random() * 8 + 5}px`,
          height: `${Math.random() * 8 + 5}px`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 0.5}s`,
        },
      }));
      
      setConfetti(newConfetti);
      
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {confetti.map((item) => (
        <div
          key={item.id}
          className="confetti animate-confetti"
          style={item.style}
        />
      ))}
    </div>
  );
};

// Create falling hearts component - optimized for mobile
export const FallingHearts: React.FC<FallingHeartsProps> = ({ isActive }) => {
  const [hearts, setHearts] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  
  useEffect(() => {
    if (isActive) {
      // Reduce number of hearts on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const heartCount = isMobile ? 15 : 30;
      
      const newHearts = Array.from({ length: heartCount }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          top: `-${Math.random() * 20}px`,
          opacity: Math.random() * 0.7 + 0.3,
          fontSize: `${Math.random() * 20 + 10}px`,
          animationDuration: `${Math.random() * 4 + 3}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
      }));
      
      setHearts(newHearts);
      
      const timer = setTimeout(() => {
        setHearts([]);
      }, 7000);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-wedding-blush animate-fall-heart"
          style={heart.style}
        >
          ❤
        </div>
      ))}
    </div>
  );
};

// Create fireworks component with sound - optimized for performance
export const FireworksDisplay: React.FC<FireworksDisplayProps> = ({ isActive }) => {
  const [fireworks, setFireworks] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (isActive) {
      // Create and play audio
      audioRef.current = new Audio("/sounds/firework-sound.mp3");
      
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio play prevented by browser", error);
          });
        }
      }
      
      // Reduce number of particles on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 20 : 40;
      
      const newFireworks = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        style: {
          left: `${40 + Math.random() * 20}vw`,
          top: `${20 + Math.random() * 20}vh`,
          backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
          width: `${Math.random() * 5 + 3}px`,
          height: `${Math.random() * 5 + 3}px`,
          animationDuration: `${Math.random() * 2 + 1}s`,
          animationDelay: `${Math.random() * 0.3}s`,
          opacity: 0,
        },
      }));
      
      setFireworks(newFireworks);
      
      const timer = setTimeout(() => {
        setFireworks([]);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
    
    return undefined;
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {fireworks.map((item) => (
        <div
          key={item.id}
          className="firework absolute animate-firework"
          style={item.style}
        />
      ))}
    </div>
  );
};
