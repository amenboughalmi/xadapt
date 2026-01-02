import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Volume2, VolumeX, Bell } from 'lucide-react';
import { useContextStore } from '../store';

interface Alert {
  id: string;
  context: string;
  severity: 'warning' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
}

const AlertSystem: React.FC = () => {
  const { state } = useContextStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Check thresholds and generate alerts
  React.useEffect(() => {
    if (!state) return;
    
    const contextValues = [
      { name: 'Temperature', value: state.temperature?.outdoor || 0, critical: 40, warning: 35 },
      { name: 'Luminosity', value: state.luminosity?.brightness || 0, critical: 95, warning: 85 },
      { name: 'Watering', value: state.watering?.soilMoisture || 0, critical: 10, warning: 20 },
      { name: 'Movement', value: state.movement?.activity || 0, critical: 100, warning: 80 },
    ];

    const newAlerts: Alert[] = [];

    contextValues.forEach(ctx => {
      const alertId = `${ctx.name}-${Date.now()}`;
      if (ctx.value >= ctx.critical && !dismissedIds.has(alertId)) {
        newAlerts.push({
          id: alertId,
          context: ctx.name,
          severity: 'critical',
          message: `${ctx.name} CRITICAL: ${ctx.value.toFixed(1)}`,
          value: ctx.value,
          threshold: ctx.critical,
          timestamp: new Date(),
        });

        if (soundEnabled) {
          playAlert('critical');
        }
      } else if (ctx.value >= ctx.warning && !dismissedIds.has(alertId)) {
        newAlerts.push({
          id: alertId,
          context: ctx.name,
          severity: 'warning',
          message: `${ctx.name} warning: ${ctx.value.toFixed(1)}`,
          value: ctx.value,
          threshold: ctx.warning,
          timestamp: new Date(),
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts].slice(0, 10));
    }
  }, [state, dismissedIds, soundEnabled]);

  const playAlert = (type: 'critical' | 'warning') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    if (type === 'critical') {
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const dismissAlert = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const activeAlerts = alerts.filter(a => !dismissedIds.has(a.id));
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell size={24} className={criticalCount > 0 ? 'text-red-400 animate-pulse' : 'text-gray-400'} />
          Alert System
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </motion.button>
      </div>

      {/* Active Alerts Feed */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHistory(!showHistory)}
        className="w-full p-4 rounded-lg bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-600/50 hover:border-red-500 text-white transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-400" />
          <span className="font-semibold">{activeAlerts.length} Active Alerts</span>
          {criticalCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-600 rounded text-xs font-bold animate-pulse">
              {criticalCount} CRITICAL
            </span>
          )}
        </div>
      </motion.button>

      {/* Alerts History Modal */}
      <AnimatePresence>
        {showHistory && activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[75vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Alert History</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHistory(false)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="p-6 space-y-3">
                {activeAlerts.map((alert, idx) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-lg border flex justify-between items-start ${
                      alert.severity === 'critical'
                        ? 'bg-red-900/30 border-red-600 text-red-300'
                        : 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{alert.message}</p>
                      <p className="text-xs mt-1">
                        {alert.timestamp.toLocaleTimeString()} • Threshold: {alert.threshold.toFixed(1)}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 rounded hover:bg-white/10 ml-2"
                    >
                      <X size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-300">
        <p>🔔 <strong>Critical:</strong> Immediate action needed</p>
        <p>⚠️ <strong>Warning:</strong> Monitor closely</p>
        <p>🔊 <strong>Sound:</strong> Toggle to mute/unmute alerts</p>
      </div>
    </div>
  );
};

export default AlertSystem;
