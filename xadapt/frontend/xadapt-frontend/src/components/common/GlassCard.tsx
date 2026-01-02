import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl';
  glowColor?: string;
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  blurIntensity = 'md',
  glowColor = '#4A90E2',
  interactive = true
}) => {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      className={`
        rounded-2xl p-6 overflow-hidden relative
        ${blurMap[blurIntensity]}
        border border-white/20
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), 0 0 30px ${glowColor}20`
      }}
      whileHover={interactive ? {
        y: -5,
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.15), 0 0 40px ${glowColor}40`
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
