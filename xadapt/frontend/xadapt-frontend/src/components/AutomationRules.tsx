import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ToggleRight, AlertCircle } from 'lucide-react';

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: Array<{
    context: string;
    operator: 'greater' | 'less' | 'equals' | 'changed';
    value: number | string;
  }>;
  actions: Array<{
    context: string;
    action: string;
  }>;
  lastTriggered?: Date;
  triggerCount: number;
}

interface AutomationRulesProps {
  rules: AutomationRule[];
  onAddRule?: (rule: AutomationRule) => void;
  onDeleteRule?: (id: string) => void;
  onToggleRule?: (id: string, enabled: boolean) => void;
}

const AutomationRules: React.FC<AutomationRulesProps> = ({
  rules = [],
  onAddRule,
  onDeleteRule,
  onToggleRule,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    enabled: true,
    conditions: [{ context: 'temperature', operator: 'greater', value: 30 }],
    actions: [{ context: 'lights', action: 'on' }],
    triggerCount: 0,
  });

  const handleAddRule = () => {
    if (newRule.name && onAddRule) {
      onAddRule({
        id: `rule-${Date.now()}`,
        name: newRule.name || '',
        enabled: newRule.enabled !== false,
        conditions: newRule.conditions || [],
        actions: newRule.actions || [],
        triggerCount: 0,
      });
      setNewRule({
        name: '',
        enabled: true,
        conditions: [{ context: 'temperature', operator: 'greater', value: 30 }],
        actions: [{ context: 'lights', action: 'on' }],
        triggerCount: 0,
      });
      setShowForm(false);
    }
  };

  const operatorLabels = {
    greater: '>',
    less: '<',
    equals: '=',
    changed: 'changed',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <AlertCircle size={24} className="text-blue-400" />
          Automation Rules
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Rule
        </motion.button>
      </div>

      {/* Add Rule Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Rule Name
              </label>
              <input
                type="text"
                value={newRule.name || ''}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Cool down when hot"
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddRule}
                className="py-2 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
              >
                Create Rule
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(false)}
                className="py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
              >
                Cancel
              </motion.button>
            </div>

            <p className="text-xs text-gray-400">
              ⚠️ Basic rule: When {newRule.conditions?.[0]?.context} {operatorLabels[newRule.conditions?.[0]?.operator || 'greater']} {newRule.conditions?.[0]?.value}, then {newRule.actions?.[0]?.action} {newRule.actions?.[0]?.context}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-lg bg-gray-800/30 border border-gray-700 border-dashed text-center text-gray-400"
          >
            <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No automation rules yet</p>
            <p className="text-xs mt-1">Create one to automate context control</p>
          </motion.div>
        ) : (
          rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg border transition-all ${
                rule.enabled
                  ? 'bg-gray-800 border-blue-500/30'
                  : 'bg-gray-900/50 border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{rule.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Triggered {rule.triggerCount} times
                    {rule.lastTriggered && (
                      <span className="ml-2">
                        • Last: {rule.lastTriggered.toLocaleTimeString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      onToggleRule && onToggleRule(rule.id, !rule.enabled)
                    }
                    className={`p-2 rounded-lg transition-colors ${
                      rule.enabled
                        ? 'bg-blue-600/30 text-blue-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    <ToggleRight size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteRule && onDeleteRule(rule.id)}
                    className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Rule Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">If:</span>
                  <span className="text-blue-400">
                    {rule.conditions[0]?.context} {operatorLabels[rule.conditions[0]?.operator || 'greater']} {rule.conditions[0]?.value}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Then:</span>
                  <span className="text-green-400">
                    {rule.actions[0]?.action} {rule.actions[0]?.context}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AutomationRules;
