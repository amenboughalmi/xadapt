import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { useContextStore } from '../store';

interface Trend {
  context: string;
  current: number;
  previous: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
  projected: number;
  daysToThreshold: number | null;
  icon: React.ReactNode;
}

const TrendPredictor: React.FC = () => {
  const { state } = useContextStore();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [history, setHistory] = useState<Record<string, number[]>>({
    temperature: [],
    luminosity: [],
    watering: [],
    movement: [],
  });

  useEffect(() => {
    if (!state) return;
    
    // Track history
    setHistory(prev => ({
      temperature: [...(prev.temperature || []).slice(-29), state.temperature?.outdoor || 0],
      luminosity: [...(prev.luminosity || []).slice(-29), state.luminosity?.brightness || 0],
      watering: [...(prev.watering || []).slice(-29), state.watering?.soilMoisture || 0],
      movement: [...(prev.movement || []).slice(-29), state.movement?.activity || 0],
    }));
  }, [state]);

  useEffect(() => {
    const calculateTrends = () => {
      const contexts = [
        { name: 'Temperature', value: state?.temperature?.outdoor || 0, critical: 40 },
        { name: 'Luminosity', value: state?.luminosity?.brightness || 0, critical: 95 },
        { name: 'Watering', value: state?.watering?.soilMoisture || 0, critical: 10 },
        { name: 'Movement', value: state?.movement?.activity || 0, critical: 100 },
      ];

      const newTrends = contexts.map(ctx => {
        const historyArray = history[ctx.name.toLowerCase()] || [];
        const previous = historyArray.length > 1 ? historyArray[historyArray.length - 2] : ctx.value;
        const change = ctx.value - previous;
        const direction: 'up' | 'down' | 'stable' = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';

        // Simple linear projection
        const avgChange = historyArray.length > 5
          ? (historyArray[historyArray.length - 1] - historyArray[Math.max(0, historyArray.length - 5)]) / 5
          : change;
        const projected = ctx.value + (avgChange * 5);

        // Days to critical
        let daysToThreshold = null;
        if (avgChange !== 0 && direction === 'up') {
          daysToThreshold = Math.ceil((ctx.critical - ctx.value) / avgChange);
        } else if (avgChange !== 0 && direction === 'down' && ctx.critical < ctx.value) {
          daysToThreshold = Math.ceil((ctx.value - ctx.critical) / Math.abs(avgChange));
        }

        return {
          context: ctx.name,
          current: ctx.value,
          previous,
          change,
          direction,
          projected: Math.max(0, projected),
          daysToThreshold: daysToThreshold && daysToThreshold > 0 ? daysToThreshold : null,
          icon: direction === 'up' 
            ? <TrendingUp className="text-red-400" size={18} />
            : direction === 'down'
            ? <TrendingDown className="text-green-400" size={18} />
            : <Minus className="text-blue-400" size={18} />,
        };
      });

      setTrends(newTrends);
    };

    if (Object.values(history).some(arr => arr.length > 0)) {
      calculateTrends();
    }
  }, [history, state]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <TrendingUp size={24} className="text-cyan-400" />
        Trend Analysis
      </h2>

      <div className="space-y-3">
        {trends.map((trend, idx) => (
          <motion.div
            key={trend.context}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {trend.icon}
                <span className="font-semibold text-white">{trend.context}</span>
              </div>
              <span className={`text-sm font-bold ${
                trend.direction === 'up' ? 'text-red-400' : trend.direction === 'down' ? 'text-green-400' : 'text-blue-400'
              }`}>
                {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="p-2 bg-gray-700/50 rounded">
                <p className="text-gray-400">Current</p>
                <p className="font-semibold text-white">{trend.current.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-gray-700/50 rounded">
                <p className="text-gray-400">Projected</p>
                <p className="font-semibold text-cyan-400">{trend.projected.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-gray-700/50 rounded">
                <p className="text-gray-400">Prev</p>
                <p className="font-semibold text-gray-300">{trend.previous.toFixed(1)}</p>
              </div>
            </div>

            {trend.daysToThreshold && (
              <div className="p-2 rounded-lg bg-yellow-900/30 border border-yellow-600/50 flex items-center gap-2 text-xs text-yellow-300">
                <AlertCircle size={14} />
                <span>⏱️ {trend.daysToThreshold} days to threshold</span>
              </div>
            )}

            {/* Mini progress bar */}
            <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(100, (trend.current / 100) * 100)}%` }}
                className={`h-full ${
                  trend.direction === 'up' ? 'bg-red-500' : trend.direction === 'down' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-300">
        <p>📈 <strong>Trend:</strong> Up/Down/Stable changes</p>
        <p>⏱️ <strong>Projection:</strong> 5-step future estimate</p>
        <p>⚠️ <strong>Threshold:</strong> Days until critical level</p>
      </div>
    </div>
  );
};

export default TrendPredictor;
