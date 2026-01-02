import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Zap, Clock } from 'lucide-react';
import type { ContextUpdateEvent } from '../types';
import { socketService } from '../services/socket';

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  value?: any;
  severity: 'info' | 'warning' | 'critical';
}

interface ActivityFeedProps {
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ maxItems = 10 }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const getContextIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return '🌡️';
      case 'silentMode':
        return '🔇';
      case 'luminosity':
        return '☀️';
      case 'watering':
        return '💧';
      case 'movement':
        return '📍';
      case 'drivingMode':
        return '🚗';
      case 'lights':
        return '💡';
      default:
        return '⚙️';
    }
  };

  const getSeverity = (type: string, value: any): 'info' | 'warning' | 'critical' => {
    if (value?.manual) return 'critical';
    
    switch (type) {
      case 'temperature':
        if (value?.outdoor > 35 || value?.outdoor < 5) return 'critical';
        if (value?.outdoor > 30 || value?.outdoor < 10) return 'warning';
        break;
      case 'luminosity':
        if (value?.brightness < 5 || value?.brightness > 95) return 'warning';
        break;
      case 'watering':
        if (value?.soilMoisture < 20) return 'critical';
        if (value?.soilMoisture < 35) return 'warning';
        break;
      case 'drivingMode':
        if (value?.drivingMode) return 'warning';
        break;
    }
    return 'info';
  };

  const addActivity = (type: string, message: string, value: any) => {
    const id = `${Date.now()}-${Math.random()}`;
    const severity = getSeverity(type, value);

    setActivities((prev) => {
      const updated = [
        {
          id,
          type,
          message,
          timestamp: new Date(),
          value,
          severity,
        },
        ...prev,
      ];
      return updated.slice(0, maxItems);
    });
  };

  // Listen for context updates from socket
  useEffect(() => {
    const unsubscribe = socketService.on('contextUpdate', (event: ContextUpdateEvent) => {
      addActivity(event.type, event.payload?.explanation || `${event.type} updated`, event.payload);
    });

    return unsubscribe;
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/30 bg-red-900/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-900/10';
      default:
        return 'border-blue-500/30 bg-blue-900/10';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-l border-gray-700">
      <div className="p-4 border-b border-gray-700 sticky top-0 z-10 bg-gray-900/95 backdrop-blur">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap size={20} className="text-blue-400" />
          Live Activity
        </h2>
        <p className="text-xs text-gray-400 mt-1">Real-time context changes</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence mode="popLayout">
          {activities.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center text-gray-500 text-sm"
            >
              <div className="text-center">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p>No activities yet</p>
                <p className="text-xs mt-1">Context changes will appear here</p>
              </div>
            </motion.div>
          ) : (
            activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-lg border ${getSeverityColor(activity.severity)} backdrop-blur-sm`}
              >
                <div className="flex gap-2">
                  <div className="text-xl flex-shrink-0 mt-0.5">
                    {getContextIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">
                          {activity.type}
                        </p>
                        <p className="text-xs text-gray-300 line-clamp-2 mt-0.5">
                          {activity.message}
                        </p>
                      </div>
                      {activity.severity === 'critical' && (
                        <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={12} className={getSeverityTextColor(activity.severity)} />
                      <p className={`text-xs ${getSeverityTextColor(activity.severity)}`}>
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityFeed;
