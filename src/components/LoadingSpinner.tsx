import React from 'react';

const LoadingSpinner: React.FC<{
  size?: 'small' | 'medium' | 'large';
}> = ({ size = 'medium' }) => (
  <div className={`flex justify-center items-center ${size === 'small' ? 'h-24' : size === 'large' ? 'h-64' : 'h-48'}`}>
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

export default LoadingSpinner;
