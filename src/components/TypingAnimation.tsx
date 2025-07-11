import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  delay = 0,
  speed = 100,
  className = '',
  onComplete,
  cursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;
    
    // Reset when text changes
    if (text !== displayedText && displayedText.length === 0) {
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);
      
      return () => clearInterval(typingInterval);
    }
  }, [text, isTyping, displayedText, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && isTyping && !isComplete && (
        <span className="inline-block w-[2px] h-[0.9em] bg-wedding-gold ml-[1px] animate-blink"></span>
      )}
    </span>
  );
};

export default TypingAnimation; 