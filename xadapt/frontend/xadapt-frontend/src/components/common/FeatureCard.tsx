import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient,
  stats
}) => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden h-full"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: gradient
        }}
      />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-xl border border-white/20" />

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col justify-between">
        {/* Icon section */}
        <motion.div
          className="text-5xl mb-6 filter drop-shadow-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.div>

        {/* Text section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#1E4A5A] mb-2">{title}</h3>
          <p className="text-[#1E4A5A]/70 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Stats section */}
        {stats && stats.length > 0 && (
          <div className="flex gap-4 pt-6 border-t border-white/20">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xl font-bold text-[#4A90E2]">{stat.value}</span>
                <span className="text-xs text-[#1E4A5A]/60">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `radial-gradient(circle at center, ${gradient}, transparent)`
        }}
        whileHover={{
          opacity: 0.1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FeatureCard;
