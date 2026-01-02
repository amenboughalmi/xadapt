import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAutomationRules } from '../hooks/queries';

const RuleStatistics: React.FC = () => {
  const { data: rules = [] } = useAutomationRules();
  const ruleArray = (rules as any[]) || [];

  const totalRules = ruleArray.length;
  const enabledRules = ruleArray.filter((r: any) => r.enabled).length;
  const totalTriggers = ruleArray.reduce((sum: number, r: any) => sum + (r.triggerCount || 0), 0);
  const mostTriggeredRule = ruleArray.length > 0
    ? [...ruleArray].sort((a: any, b: any) => (b.triggerCount || 0) - (a.triggerCount || 0))[0]
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={24} className="text-cyan-400" />
          Rule Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-600/50"
        >
          <div className="text-2xl font-bold text-blue-400">{totalRules}</div>
          <p className="text-xs text-gray-400">Total Rules</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-lg bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-600/50"
        >
          <div className="text-2xl font-bold text-green-400">{enabledRules}</div>
          <p className="text-xs text-gray-400">Enabled</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-lg bg-gradient-to-br from-orange-900/30 to-orange-800/30 border border-orange-600/50"
        >
          <div className="text-2xl font-bold text-orange-400">{totalTriggers}</div>
          <p className="text-xs text-gray-400">Total Triggers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-600/50"
        >
          <div className="text-2xl font-bold text-purple-400">
            {mostTriggeredRule ? mostTriggeredRule.triggerCount : 0}
          </div>
          <p className="text-xs text-gray-400">Max Triggers</p>
        </motion.div>
      </div>

      {mostTriggeredRule && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-gray-800 border border-gray-700 space-y-2"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-purple-400" />
            <h3 className="font-semibold text-white text-sm">Most Triggered Rule</h3>
          </div>
          <p className="text-sm text-gray-300 capitalize">{mostTriggeredRule.name}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} />
            <span>Triggered {mostTriggeredRule.triggerCount} times</span>
            {mostTriggeredRule.lastTriggered && (
              <span>• Last: {new Date(mostTriggeredRule.lastTriggered).toLocaleDateString()}</span>
            )}
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {ruleArray.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400">All Rules</h3>
            <AnimatePresence>
              {ruleArray.map((rule: any, idx: number) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-2 rounded bg-gray-800/50 border border-gray-700/50 flex items-center justify-between text-xs"
                >
                  <span className="text-gray-300 capitalize">{rule.name}</span>
                  <span className="text-blue-400 font-semibold">{rule.triggerCount} triggers</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleStatistics;
