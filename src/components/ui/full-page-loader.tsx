import React, { useState, useEffect } from 'react';
import LoadingSpinner from './loading-spinner';
import LoadingDots from './loading-dots';

interface FullPageLoaderProps {
  message?: string;
  showSkeleton?: boolean;
  delay?: number;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ 
  message = 'Loading your profile...',
  showSkeleton = true,
  delay = 2000
}) => {
  const [showSkeletonState, setShowSkeletonState] = useState(!showSkeleton);

  useEffect(() => {
    if (showSkeleton) {
      const timer = setTimeout(() => {
        setShowSkeletonState(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [showSkeleton, delay]);

  if (!showSkeletonState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
            <LoadingDots size="md" color="bg-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FullPageLoader; 