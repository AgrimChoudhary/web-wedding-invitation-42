import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedLoadingIndicatorProps {
  progress: number;
  connectionSpeed?: 'fast' | 'medium' | 'slow' | 'unknown';
  criticalImagesLoaded: number;
  totalImages: number;
  className?: string;
}

export const AdvancedLoadingIndicator: React.FC<AdvancedLoadingIndicatorProps> = ({
  progress,
  connectionSpeed = 'unknown',
  criticalImagesLoaded,
  totalImages,
  className
}) => {
  const getConnectionIcon = () => {
    switch (connectionSpeed) {
      case 'fast':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'medium':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'slow':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionSpeed) {
      case 'fast':
        return 'Fast connection detected';
      case 'medium':
        return 'Optimizing for your connection';
      case 'slow':
        return 'Loading essentials first';
      default:
        return 'Detecting connection speed';
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 p-6", className)}>
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {getConnectionIcon()}
        <span>{getConnectionText()}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Loading images...</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Critical Images Status */}
      {criticalImagesLoaded > 0 && (
        <div className="text-xs text-center text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Critical images ready ({criticalImagesLoaded}/{totalImages})</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};