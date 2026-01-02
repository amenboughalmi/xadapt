import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useContextStore } from '../store';

interface EnergyMetric {
  device: string;
  consumption: number;
  efficiency: number;
  trend: 'improving' | 'stable' | 'declining';
}

const EfficiencyDashboard: React.FC = () => {
  const { state } = useContextStore();
  const [energyMetrics, setEnergyMetrics] = useState<EnergyMetric[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [todayConsumption, setTodayConsumption] = useState(0);

  useEffect(() => {
    if (!state) return;
    
    // Calculate efficiency metrics based on context values
    const metrics: EnergyMetric[] = [
      {
        device: 'Temperature System',
        consumption: Math.abs((state.temperature?.outdoor || 0) - 22) * 1.5,
        efficiency: 100 - Math.abs((state.temperature?.outdoor || 0) - 22),
        trend: (state.temperature?.outdoor || 0) < 25 ? 'improving' : 'declining',
      },
      {
        device: 'Lighting',
        consumption: (100 - (state.luminosity?.brightness || 0)) * 0.8,
        efficiency: Math.min(100, state.luminosity?.brightness || 0),
        trend: (state.luminosity?.brightness || 0) < 80 ? 'improving' : 'stable',
      },
      {
        device: 'Irrigation',
        consumption: Math.abs((state.watering?.soilMoisture || 0) - 50) * 1.2,
        efficiency: 100 - Math.abs((state.watering?.soilMoisture || 0) - 50),
        trend: (state.watering?.soilMoisture || 0) > 40 ? 'improving' : 'declining',
      },
      {
        device: 'Motion Sensors',
        consumption: (state.movement?.activity || 0) * 0.5,
        efficiency: 100 - (state.movement?.activity || 0),
        trend: (state.movement?.activity || 0) < 60 ? 'improving' : 'stable',
      },
    ];

    setEnergyMetrics(metrics);

    // Calculate overall efficiency score
    const avgEfficiency = metrics.reduce((sum, m) => sum + m.efficiency, 0) / metrics.length;
    setTotalScore(Math.round(avgEfficiency));

    // Total energy consumption
    const total = metrics.reduce((sum, m) => sum + m.consumption, 0);
    setTodayConsumption(Math.round(total * 10) / 10);
  }, [state]);

  const estimatedCost = (todayConsumption * 0.12).toFixed(2); // $0.12 per unit
  const trendCount = {
    improving: energyMetrics.filter(m => m.trend === 'improving').length,
    stable: energyMetrics.filter(m => m.trend === 'stable').length,
    declining: energyMetrics.filter(m => m.trend === 'declining').length,
  };

  // Badges based on score
  const getBadge = (score: number) => {
    if (score >= 90) return { text: '⭐ Excellent', color: 'text-green-400' };
    if (score >= 75) return { text: '👍 Good', color: 'text-blue-400' };
    if (score >= 60) return { text: '⚠️ Fair', color: 'text-yellow-400' };
    return { text: '❌ Poor', color: 'text-red-400' };
  };

  const badge = getBadge(totalScore);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Zap size={24} className="text-yellow-400" />
        Energy & Efficiency
      </h2>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-600/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Efficiency Score</p>
            <p className={`text-4xl font-bold mt-2 ${badge.color}`}>{totalScore}%</p>
            <p className={`text-sm font-semibold mt-1 ${badge.color}`}>{badge.text}</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="text-6xl"
          >
            ⚡
          </motion.div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
        >
          <p className="text-gray-400 text-xs">Daily Consumption</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{todayConsumption}</p>
          <p className="text-xs text-gray-500 mt-1">kWh</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
        >
          <p className="text-gray-400 text-xs">Est. Cost</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">${estimatedCost}</p>
          <p className="text-xs text-gray-500 mt-1">Daily rate</p>
        </motion.div>
      </div>

      {/* Device Breakdown */}
      <div className="space-y-2">
        {energyMetrics.map((metric, idx) => (
          <motion.div
            key={metric.device}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{metric.device}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                metric.trend === 'improving' ? 'bg-green-900/50 text-green-400' :
                metric.trend === 'stable' ? 'bg-blue-900/50 text-blue-400' :
                'bg-red-900/50 text-red-400'
              }`}>
                {metric.trend === 'improving' && '↓ Improving'}
                {metric.trend === 'stable' && '→ Stable'}
                {metric.trend === 'declining' && '↑ Declining'}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${metric.efficiency}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Efficiency: {metric.efficiency.toFixed(1)}%</span>
              <span>Use: {metric.consumption.toFixed(1)} units</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-300 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-green-400 font-bold">{trendCount.improving}</p>
          <p>Improving</p>
        </div>
        <div>
          <p className="text-blue-400 font-bold">{trendCount.stable}</p>
          <p>Stable</p>
        </div>
        <div>
          <p className="text-red-400 font-bold">{trendCount.declining}</p>
          <p>Declining</p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-700 text-xs text-blue-300">
        <p>💡 <strong>Tip:</strong> Keep luminosity under 80% and watering near 50% for optimal efficiency</p>
      </div>
    </div>
  );
};

export default EfficiencyDashboard;
