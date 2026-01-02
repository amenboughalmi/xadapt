import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';
import ContextTimeline from './ContextTimeline';

interface ContextCardProProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  value: string | number;
  unit?: string;
  explanation?: string;
  status?: 'normal' | 'warning' | 'critical';
  timelineData?: Array<{ timestamp: Date; value: number; label: string }>;
  onOverrideChange?: (action: string) => void;
  isManual?: boolean;
  children?: React.ReactNode;
}

const ContextCardPro: React.FC<ContextCardProProps> = ({
  title,
  icon,
  color,
  value,
  unit,
  explanation,
  status = 'normal',
  timelineData,
  onOverrideChange,
  isManual,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    normal: 'border-gray-700 shadow-lg',
    warning: 'border-yellow-500/50 shadow-lg shadow-yellow-500/20',
    critical: 'border-red-500/50 shadow-lg shadow-red-500/20',
  };

  const statusBadgeColor = {
    normal: 'bg-green-900/30 text-green-400',
    warning: 'bg-yellow-900/30 text-yellow-400',
    critical: 'bg-red-900/30 text-red-400',
  };

  const statusIcon = {
    normal: <CheckCircle size={14} />,
    warning: <AlertTriangle size={14} />,
    critical: <AlertTriangle size={14} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ${statusColors[status]} ${
        isManual ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gray-800/50'
      }`}
    >
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${color}`}>{icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {isManual && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-purple-900/50 text-purple-400 rounded">
                  🎯 Manual Override
                </span>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${statusBadgeColor[status]}`}>
              {statusIcon[status]}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            {timelineData && <ChevronDown size={20} className="text-gray-400" />}
          </motion.div>
        </div>

        {/* Main Value */}
        <motion.div
          key={value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-bold text-white mb-2"
        >
          {value}
          {unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
        </motion.div>

        {/* Explanation */}
        {explanation && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {explanation}
          </p>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700"
        >
          <div className="p-4 space-y-4">
            {/* Timeline */}
            {timelineData && timelineData.length > 0 && (
              <ContextTimeline
                data={timelineData}
                unit={unit}
              />
            )}

            {/* Controls */}
            {onOverrideChange && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOverrideChange('on')}
                    className="py-2 px-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold text-sm transition-all"
                  >
                    ✓ On/Enable
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOverrideChange('off')}
                    className="py-2 px-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm transition-all"
                  >
                    ✕ Off/Disable
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOverrideChange('auto')}
                    className="col-span-2 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm transition-all"
                  >
                    🔄 Return to Auto
                  </motion.button>
                </div>
              </div>
            )}

            {/* Custom children */}
            {children && <div className="pt-2 border-t border-gray-700">{children}</div>}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContextCardPro;
