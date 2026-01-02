import React from 'react';

interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s infinite'
      }}
    >
      {children}
    </div>
  );
};

export default Shimmer;
