import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, X, Copy } from 'lucide-react';
import { useToast } from './Toast';

interface ContextEvent {
  _id: string;
  type: string;
  payload: Record<string, any>;
  explanation: string;
  createdAt: string;
}

const DataExport: React.FC = () => {
  const { addToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  // Use empty array - events not available in this context
  const events: ContextEvent[] = [];

  const handleCopyJson = () => {
    const json = JSON.stringify(events, null, 2);
    navigator.clipboard.writeText(json);
    addToast('✓ Copied to clipboard', 'success', 2000);
  };

  const handleCopyCsv = () => {
    let csv = 'Type,Value,Explanation,Timestamp\n';
    events.forEach(event => {
      const value = JSON.stringify(event.payload).replace(/"/g, '""');
      const explanation = (event.explanation || '').replace(/"/g, '""');
      csv += `${event.type},"${value}","${explanation}",${new Date(event.createdAt).toISOString()}\n`;
    });
    navigator.clipboard.writeText(csv);
    addToast('✓ CSV copied to clipboard', 'success', 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Eye size={24} className="text-blue-400" />
          Event Viewer
        </h2>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="w-full p-4 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-600/50 hover:border-blue-500 text-white transition-all flex flex-col items-center gap-2"
      >
        <Eye size={24} className="text-blue-400" />
        <div>
          <p className="font-semibold text-sm">View Events</p>
          <p className="text-xs text-gray-400">{events.length} recent events</p>
        </div>
      </motion.button>

      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-xs text-gray-300 space-y-1">
        <p>👁️ <strong>View:</strong> See last 20 events</p>
        <p>📋 <strong>Copy:</strong> Export as JSON or CSV</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Recent Events</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Copy Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyJson}
                  className="p-3 rounded-lg bg-blue-900/30 border border-blue-600/50 hover:border-blue-500 text-white flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Copy as JSON
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyCsv}
                  className="p-3 rounded-lg bg-green-900/30 border border-green-600/50 hover:border-green-500 text-white flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Copy as CSV
                </motion.button>
              </div>

              {/* Events Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 font-semibold text-blue-400">Type</th>
                      <th className="text-left p-3 font-semibold text-green-400">Value</th>
                      <th className="text-left p-3 font-semibold text-yellow-400">Explanation</th>
                      <th className="text-left p-3 font-semibold text-gray-400">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 ? (
                      events.map((event, idx) => (
                        <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                          <td className="p-3 text-blue-400 font-semibold">{event.type}</td>
                          <td className="p-3 text-green-400">
                            {typeof event.payload === 'object' 
                              ? JSON.stringify(event.payload).substring(0, 50)
                              : event.payload}
                          </td>
                          <td className="p-3 text-yellow-400">{event.explanation || '-'}</td>
                          <td className="p-3 text-gray-500 text-xs">
                            {new Date(event.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-gray-500">
                          No events yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DataExport;
