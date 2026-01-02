import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StatCounterProps {
  start?: number;
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  label?: string;
  color?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  start = 0,
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon,
  label,
  color = '#4A90E2'
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const value = Math.floor(start + (end - start) * progress);
      setCount(value);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [start, end, duration]);

  const displayValue = `${prefix}${count.toFixed(decimals)}${suffix}`;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {icon && (
        <motion.div
          className="text-3xl"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.div>
      )}
      <div className="text-center">
        <motion.div
          className="text-4xl font-bold"
          style={{ color }}
        >
          {displayValue}
        </motion.div>
        {label && (
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCounter;
