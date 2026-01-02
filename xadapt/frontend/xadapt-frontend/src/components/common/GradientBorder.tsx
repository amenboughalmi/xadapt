import React from 'react';

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  colors?: string[];
  animated?: boolean;
}

export const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  className = '',
  borderWidth = 2,
  colors = ['#4A90E2', '#00D9FF', '#9D4EDD'],
  animated = true
}) => {
  return (
    <div
      className={`relative rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(
          ${animated ? '45deg' : '135deg'},
          ${colors.join(', ')}
        )`,
        backgroundSize: animated ? '200% 200%' : '100% 100%',
        animation: animated ? 'gradient-shift 3s ease infinite' : 'none',
        padding: borderWidth
      }}
    >
      <div className="relative bg-white rounded-2xl h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default GradientBorder;
