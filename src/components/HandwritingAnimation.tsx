import React, { useState, useEffect } from 'react';

interface HandwritingAnimationProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const HandwritingAnimation: React.FC<HandwritingAnimationProps> = ({
  text,
  delay = 0,
  className = '',
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 3000); // Duration of handwriting animation
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, onComplete]);
  
  return (
    <span 
      className={`relative inline-block ${className} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ transition: 'opacity 0.5s ease' }}
    >
      {isVisible && (
        <>
          {text.split('').map((char, index) => (
            <span 
              key={index}
              className="relative inline-block"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '1s',
              }}
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
};

export default HandwritingAnimation;

// Define these animations in global.css or in a style tag
const globalStyle = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes writeWidth {
  from { width: 0; }
  to { width: 100%; }
}
`;

// Add style tag to ensure the animations work
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = globalStyle;
  document.head.appendChild(styleEl);
} 