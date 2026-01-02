import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Home, Lightbulb, Wind } from 'lucide-react';

export interface Device {
  id: string;
  name: string;
  type: 'room' | 'device';
  location: string;
  icon: string;
  isActive: boolean;
  lastUpdated: Date;
}

interface MultiDeviceProps {
  devices?: Device[];
  selectedDevice?: string;
  onSelectDevice?: (id: string) => void;
  onAddDevice?: (device: Device) => void;
  onRemoveDevice?: (id: string) => void;
}

const MultiDevice: React.FC<MultiDeviceProps> = ({
  devices = [],
  selectedDevice,
  onSelectDevice,
  onAddDevice,
  onRemoveDevice,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newDevice, setNewDevice] = useState<{ name: string; type: 'room' | 'device'; location: string }>({
    name: '',
    type: 'room',
    location: '',
  });

  const handleAddDevice = () => {
    if (newDevice.name && onAddDevice) {
      onAddDevice({
        id: `device-${Date.now()}`,
        name: newDevice.name,
        type: newDevice.type,
        location: newDevice.location,
        icon: newDevice.type === 'room' ? '🏠' : '⚙️',
        isActive: true,
        lastUpdated: new Date(),
      });
      setNewDevice({ name: '', type: 'room', location: '' });
      setShowForm(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'room':
        return <Home size={20} />;
      case 'device':
        return <Lightbulb size={20} />;
      default:
        return <Wind size={20} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Home size={24} className="text-green-400" />
          Devices & Rooms
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Device
        </motion.button>
      </div>

      {/* Add Device Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-gray-800 border border-gray-700 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="e.g., Living Room"
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newDevice.type}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, type: e.target.value as 'room' | 'device' })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-green-500"
                >
                  <option value="room">Room</option>
                  <option value="device">Device</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                placeholder="e.g., 2nd Floor"
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddDevice}
                className="py-2 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors"
              >
                Add Device
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full p-6 rounded-lg bg-gray-800/30 border border-gray-700 border-dashed text-center text-gray-400"
          >
            <Home size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No devices yet</p>
            <p className="text-xs mt-1">Add a room or device to get started</p>
          </motion.div>
        ) : (
          devices.map((device) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectDevice && onSelectDevice(device.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedDevice === device.id
                  ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-400 shadow-lg shadow-green-500/30'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${selectedDevice === device.id ? 'bg-white/20' : 'bg-gray-700'}`}>
                  <div className={selectedDevice === device.id ? 'text-white' : 'text-green-400'}>
                    {getDeviceIcon(device.type)}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDevice && onRemoveDevice(device.id);
                  }}
                  className={`p-1 rounded-lg transition-colors ${
                    selectedDevice === device.id
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-red-900/30 text-red-400'
                  }`}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>

              <h4 className={`font-semibold ${selectedDevice === device.id ? 'text-white' : 'text-white'}`}>
                {device.name}
              </h4>
              <p className={`text-xs ${selectedDevice === device.id ? 'text-white/70' : 'text-gray-400'} mt-1`}>
                {device.location || 'No location'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className={`text-xs ${selectedDevice === device.id ? 'text-white/60' : 'text-gray-500'}`}>
                  Active
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MultiDevice;
