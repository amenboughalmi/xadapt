import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  animated = false,
  icon
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#4A90E2] to-[#1E4A5A] text-white',
    success: 'bg-gradient-to-r from-[#34C759] to-[#00A86B] text-white',
    warning: 'bg-gradient-to-r from-[#FFA500] to-[#FF6347] text-white',
    danger: 'bg-gradient-to-r from-[#FF3B30] to-[#C92A2A] text-white',
    info: 'bg-gradient-to-r from-[#00D9FF] to-[#0099CC] text-white',
    glow: 'bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]/50'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-2 rounded-full font-semibold whitespace-nowrap
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${variant === 'glow' ? 'shadow-lg' : 'shadow-md'}
        transition-all duration-300
      `}
      animate={animated && variant === 'glow' ? {
        boxShadow: [
          '0 0 10px rgba(74, 144, 226, 0.3)',
          '0 0 20px rgba(74, 144, 226, 0.6)',
          '0 0 10px rgba(74, 144, 226, 0.3)'
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </motion.span>
  );
};

export default Badge;
