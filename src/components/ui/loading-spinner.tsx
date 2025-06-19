import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`${size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'} bg-blue-500 rounded-full animate-pulse`}></div>
        </div>
      </div>
      
      {text && (
        <div className={`text-gray-600 ${textSizes[size]} font-medium animate-pulse`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 