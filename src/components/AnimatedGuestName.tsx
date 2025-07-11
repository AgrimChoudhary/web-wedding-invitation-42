import React, { useState, useEffect } from 'react';

interface AnimatedGuestNameProps {
  name: string;
  className?: string;
  animationType?: 'typing' | 'handwriting' | 'brush' | 'sparkle';
  delay?: number;
  fallback?: string;
}

const AnimatedGuestName: React.FC<AnimatedGuestNameProps> = ({
  name,
  className = '',
  animationType = 'typing',
  delay = 0,
  fallback = 'Guest Name'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const actualName = name || fallback;
  
  // Typing animation
  useEffect(() => {
    if (animationType !== 'typing') return;
    
    const delayTimer = setTimeout(() => {
      setIsAnimating(true);
      setShowCursor(true);
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < actualName.length) {
          setDisplayText(actualName.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setShowCursor(false);
            setIsComplete(true);
          }, 500);
        }
      }, 100);
      
      return () => {
        clearInterval(typingInterval);
      };
    }, delay);
    
    return () => clearTimeout(delayTimer);
  }, [actualName, animationType, delay]);
  
  // Handwriting animation
  const [isHandwritingVisible, setIsHandwritingVisible] = useState(false);
  
  useEffect(() => {
    if (animationType !== 'handwriting') return;
    
    const timer = setTimeout(() => {
      setIsHandwritingVisible(true);
      setTimeout(() => {
        setIsComplete(true);
      }, actualName.length * 100 + 500);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [actualName, animationType, delay]);
  
  // Brush animation 
  const [isBrushVisible, setIsBrushVisible] = useState(false);
  
  useEffect(() => {
    if (animationType !== 'brush') return;
    
    const timer = setTimeout(() => {
      setIsBrushVisible(true);
      setTimeout(() => {
        setIsComplete(true);
      }, 1000);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [animationType, delay]);
  
  // Sparkle animation
  const [isSparkleVisible, setIsSparkleVisible] = useState(false);
  
  useEffect(() => {
    if (animationType !== 'sparkle') return;
    
    const timer = setTimeout(() => {
      setIsSparkleVisible(true);
      setTimeout(() => {
        setIsComplete(true);
      }, 1200);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [animationType, delay]);
  
  if (animationType === 'typing') {
    return (
      <span className={className}>
        {displayText}
        {showCursor && (
          <span className="inline-block w-[2px] h-[0.9em] bg-wedding-gold ml-[1px] animate-blink"></span>
        )}
      </span>
    );
  }
  
  if (animationType === 'handwriting') {
    return (
      <span className={`relative inline-block ${className}`}>
        {isHandwritingVisible && (
          <>
            {actualName.split('').map((char, index) => (
              <span 
                key={index}
                className="relative inline-block"
              >
                <span 
                  className="relative z-10"
                  style={{
                    animation: `fadeIn 0.5s ${index * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
                <span 
                  className="absolute left-0 bottom-0 w-full h-[1px] bg-wedding-gold/50"
                  style={{
                    animation: `writeWidth 0.5s ${index * 0.1}s forwards ease-out`,
                    width: '0%',
                    transformOrigin: 'left'
                  }}
                ></span>
              </span>
            ))}
          </>
        )}
      </span>
    );
  }
  
  if (animationType === 'brush') {
    return (
      <span 
        className={`relative inline-block ${className} ${isBrushVisible ? 'opacity-100' : 'opacity-0'}`} 
        style={{
          transition: 'opacity 0.7s ease',
        }}
      >
        <span 
          className="absolute -inset-x-1 -inset-y-1 bg-gradient-to-r from-wedding-gold/0 via-wedding-gold/30 to-wedding-gold/0 rounded-md"
          style={{
            animation: isBrushVisible ? 'brushGlow 2.5s ease-in-out forwards' : 'none',
            opacity: 0,
          }}
        ></span>
        <span 
          className="relative z-10 inline-block font-semibold"
          style={{
            backgroundImage: 'linear-gradient(transparent 60%, rgba(212, 175, 55, 0.3) 40%)',
            backgroundSize: isBrushVisible ? '100% 100%' : '0% 100%',
            backgroundRepeat: 'no-repeat',
            transition: 'background-size 1.2s ease-out',
            padding: '0 4px',
            textShadow: isBrushVisible ? '0 0 3px rgba(212, 175, 55, 0.5)' : 'none',
            color: isBrushVisible ? '#8B4513' : '#666',
          }}
        >
          {actualName}
        </span>
      </span>
    );
  }
  
  if (animationType === 'sparkle') {
    return (
      <span className={`relative inline-block ${className}`}>
        <span 
          className="absolute inset-0 bg-gradient-to-r from-wedding-gold/0 via-wedding-gold/40 to-wedding-gold/0" 
          style={{
            animation: isSparkleVisible ? 'shimmerEffect 2s infinite' : 'none',
            borderRadius: '4px',
            transform: 'skewX(-15deg)',
            filter: 'blur(1px)',
            zIndex: 0
          }}
        ></span>
        {actualName.split('').map((char, index) => (
          <span 
            key={index}
            className="relative inline-block z-10 font-semibold"
            style={{
              opacity: isSparkleVisible ? 1 : 0,
              transform: isSparkleVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.5s ease, transform 0.5s ease`,
              transitionDelay: `${index * 0.06}s`,
              textShadow: isSparkleVisible ? '0 0 3px rgba(212, 175, 55, 0.5)' : 'none',
              color: isSparkleVisible ? '#8B4513' : '#666',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  }

  // Fallback - just show the name with enhanced visibility
  return (
    <span 
      className={`${className} font-semibold`}
      style={{
        color: '#8B4513',
        textShadow: '0 0 2px rgba(212, 175, 55, 0.3)'
      }}
    >
      {actualName}
    </span>
  );
};

export default AnimatedGuestName;

// Define additional animations that might not be in tailwind.config.js
const globalStyle = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes writeWidth {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes brushStroke {
  from { background-size: 0% 100%; }
  to { background-size: 100% 100%; }
}

@keyframes shimmerEffect {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes brushGlow {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}
`;

// Add style tag to ensure animations work
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = globalStyle;
  document.head.appendChild(styleEl);
} 