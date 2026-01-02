import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface DataPoint {
  timestamp: Date;
  value: number;
  label: string;
}

interface ContextTimelineProps {
  data: DataPoint[];
  maxDataPoints?: number;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

const ContextTimeline: React.FC<ContextTimelineProps> = ({
  data,
  maxDataPoints = 20,
  unit = '%',
  minValue = 0,
  maxValue = 100,
}) => {
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [avgValue, setAvgValue] = useState<number>(0);

  useEffect(() => {
    if (data.length < 2) return;

    const recentData = data.slice(-5);
    const first = recentData[0].value;
    const last = recentData[recentData.length - 1].value;

    if (last > first * 1.05) setTrend('up');
    else if (last < first * 0.95) setTrend('down');
    else setTrend('stable');

    const avg = recentData.reduce((sum, p) => sum + p.value, 0) / recentData.length;
    setAvgValue(Math.round(avg));
  }, [data]);

  const chartHeight = 100;
  const range = maxValue - minValue;
  const displayData = data.slice(-maxDataPoints);

  if (displayData.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 text-center text-gray-400 text-sm">
        No data points yet
      </div>
    );
  }

  // Calculate SVG path for line chart
  const width = 100;
  const pointWidth = width / Math.max(displayData.length - 1, 1);

  const points = displayData.map((point, idx) => {
    const x = idx * pointWidth;
    const normalizedValue = (point.value - minValue) / range;
    const y = chartHeight - normalizedValue * chartHeight;
    return `${x},${y}`;
  });

  const currentValue = displayData[displayData.length - 1].value;
  const previousValue = displayData[Math.max(0, displayData.length - 2)].value;
  const change = currentValue - previousValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-400" />
          <h4 className="text-sm font-semibold text-white">Timeline</h4>
        </div>
        <div className="flex items-center gap-2">
          {trend === 'up' && <TrendingUp size={16} className="text-red-400" />}
          {trend === 'down' && <TrendingDown size={16} className="text-blue-400" />}
          {trend === 'stable' && <div className="w-4 h-0.5 bg-gray-500" />}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="mb-4">
        <svg
          viewBox={`0 0 ${width} ${chartHeight}`}
          className="w-full h-20 mb-2"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1="0" y1={chartHeight / 2} x2={width} y2={chartHeight / 2} stroke="#374151" strokeDasharray="2" opacity="0.5" />

          {/* Line */}
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor={trend === 'up' ? '#f87171' : '#34d399'} />
            </linearGradient>
          </defs>

          {/* Current point */}
          {displayData.length > 0 && (
            <circle
              cx={width}
              cy={chartHeight - ((currentValue - minValue) / range) * chartHeight}
              r="2.5"
              fill={trend === 'up' ? '#f87171' : trend === 'down' ? '#34d399' : '#60a5fa'}
            />
          )}
        </svg>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-gray-400">Current</p>
            <p className="text-white font-semibold">{currentValue.toFixed(1)}{unit}</p>
          </div>
          <div className="bg-gray-700/50 rounded p-2">
            <p className="text-gray-400">Average</p>
            <p className="text-white font-semibold">{avgValue}{unit}</p>
          </div>
          <div className={`rounded p-2 ${change > 0 ? 'bg-red-900/30' : 'bg-blue-900/30'}`}>
            <p className="text-gray-400">Change</p>
            <p className={`font-semibold ${change > 0 ? 'text-red-400' : 'text-blue-400'}`}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}{unit}
            </p>
          </div>
        </div>
      </div>

      {/* Recent values */}
      <div className="space-y-1 max-h-24 overflow-y-auto">
        {displayData.slice().reverse().map((point, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{point.timestamp.toLocaleTimeString()}</span>
            <span className="text-white font-medium">{point.value.toFixed(1)}{unit}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ContextTimeline;
