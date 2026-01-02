import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useUpdateThreshold } from '../hooks/queries';
import { useToast } from './Toast';

const ContextThresholds: React.FC = () => {
  const { mutate: updateThreshold } = useUpdateThreshold();
  const { addToast } = useToast();

  const [editingContext, setEditingContext] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    warningMin: 15,
    warningMax: 28,
    criticalMin: 5,
    criticalMax: 35,
    customLabel: ''
  });

  const contextTypes = ['temperature', 'luminosity', 'watering'];

  const handleSave = (context: string) => {
    updateThreshold(
      { context, data: formData },
      {
        onSuccess: () => {
          addToast(`✓ Thresholds updated for ${context}`, 'success');
          setEditingContext(null);
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings size={24} className="text-yellow-400" />
          Alert Thresholds
        </h2>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {contextTypes.map((context) => (
            <motion.div
              key={context}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700"
            >
              {editingContext === context ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <label className="text-gray-400 text-xs">Warning Min</label>
                      <input
                        type="number"
                        value={formData.warningMin}
                        onChange={(e) => setFormData({ ...formData, warningMin: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Warning Max</label>
                      <input
                        type="number"
                        value={formData.warningMax}
                        onChange={(e) => setFormData({ ...formData, warningMax: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Critical Min</label>
                      <input
                        type="number"
                        value={formData.criticalMin}
                        onChange={(e) => setFormData({ ...formData, criticalMin: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs">Critical Max</label>
                      <input
                        type="number"
                        value={formData.criticalMax}
                        onChange={(e) => setFormData({ ...formData, criticalMax: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-gray-700 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSave(context)}
                      className="flex-1 px-2 py-1 rounded bg-green-600 hover:bg-green-500 text-white text-sm font-semibold"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingContext(null)}
                      className="flex-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white capitalize text-sm">{context}</h3>
                    <p className="text-xs text-gray-400">Configure alert levels</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingContext(context)}
                    className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-semibold"
                  >
                    Edit
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-400 text-center">Set custom thresholds for warning and critical alerts per context</p>
    </div>
  );
};

export default ContextThresholds;
