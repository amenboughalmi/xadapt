import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Navigation,
  Volume2,
  Zap,
  Droplets,
  Sun,
  LogOut,
  Play,
  Pause,
  Menu,
  X,
  Settings,
} from 'lucide-react';

import { useAuthStore, useContextStore } from '../store';
import {
  useContextState,
  useStartSimulation,
  useStopSimulation,
  useSetOverride,
  useAutomationRules,
  useCreateRule,
  useUpdateRule,
  useDeleteRule,
  useDevices,
  useCreateDevice,
  useDeleteDevice,
} from '../hooks/queries';
import { useSocketEvent } from '../hooks/socket';
import { useToast } from '../components/Toast';

import Card from '../components/common/Card';
import ActivityFeed from '../components/ActivityFeed';
import ContextCardPro from '../components/ContextCardPro';
import AutomationRules, { type AutomationRule } from '../components/AutomationRules';
import MultiDevice, { type Device } from '../components/MultiDevice';
import SimulationScenes from '../components/SimulationScenes';
import DataExport from '../components/DataExport';
import ContextThresholds from '../components/ContextThresholds';
import RuleStatistics from '../components/RuleStatistics';
import AlertSystem from '../components/AlertSystem';
import TrendPredictor from '../components/TrendPredictor';
import EfficiencyDashboard from '../components/EfficiencyDashboard';
import FavoritesPanel from '../components/FavoritesPanel';

const DashboardPro: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { state: contextState, updateContext, isSimulating, setSimulating } =
    useContextStore();
  const { data: stateData } = useContextState();
  const { mutate: startSim } = useStartSimulation();
  const { mutate: stopSim } = useStopSimulation();
  const { mutate: setOverride } = useSetOverride();
  const { addToast } = useToast();

  // Fetch persisted data
  const { data: dbRules = [] } = useAutomationRules();
  const { data: dbDevices = [] } = useDevices();
  const { mutate: createRule } = useCreateRule();
  const { mutate: updateRule } = useUpdateRule();
  const { mutate: deleteRule } = useDeleteRule();
  const { mutate: createDevice } = useCreateDevice();
  const { mutate: deleteDevice } = useDeleteDevice();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();
  const [devices, setDevices] = useState<Device[]>((dbDevices as any) || []);
  const [rules, setRules] = useState<AutomationRule[]>((dbRules as any) || []);
  const [timelineData, setTimelineData] = useState<
    Record<string, Array<{ timestamp: Date; value: number; label: string }>>
  >({});

  // Sync with persisted data
  useEffect(() => {
    if ((dbRules as any)?.length > 0) setRules((dbRules as any));
  }, [dbRules]);

  useEffect(() => {
    if ((dbDevices as any)?.length > 0) setDevices((dbDevices as any));
  }, [dbDevices]);

  // Initialize
  useEffect(() => {
    if (stateData?.state) {
      useContextStore.setState({ state: stateData.state });
    }
  }, [stateData]);

  // Check automation rules
  const checkAutomationRules = (event: any) => {
    rules.forEach((rule) => {
      if (!rule.enabled) return;

      const condition = rule.conditions[0];
      let triggered = false;

      if (condition.context === event.type) {
        let value = 0;
        if (event.type === 'temperature') {
          value = event.payload?.outdoor || 0;
        } else if (event.type === 'luminosity') {
          value = event.payload?.brightness || 0;
        }

        switch (condition.operator) {
          case 'greater':
            triggered = value > (typeof condition.value === 'number' ? condition.value : parseFloat(condition.value));
            break;
          case 'less':
            triggered = value < (typeof condition.value === 'number' ? condition.value : parseFloat(condition.value));
            break;
          case 'equals':
            triggered = value === (typeof condition.value === 'number' ? condition.value : parseFloat(condition.value));
            break;
          case 'changed':
            triggered = true;
            break;
        }

        if (triggered) {
          setRules((prev) =>
            prev.map((r) =>
              r.id === rule.id
                ? {
                    ...r,
                    lastTriggered: new Date(),
                    triggerCount: r.triggerCount + 1,
                  }
                : r
            )
          );
          addToast(`🤖 Rule triggered: ${rule.name}`, 'info', 3000);
        }
      }
    });
  };

  // Listen for context updates
  useSocketEvent('contextUpdate', (event: any) => {
    updateContext(event);

    // Add to timeline
    setTimelineData((prev) => {
      const contextData = prev[event.type] || [];
      let value = 0;

      if (event.type === 'temperature') {
        value = event.payload?.outdoor || 0;
      } else if (event.type === 'luminosity') {
        value = event.payload?.brightness || 0;
      } else if (event.type === 'watering') {
        value = event.payload?.soilMoisture || 0;
      }

      return {
        ...prev,
        [event.type]: [
          ...contextData.slice(-29),
          {
            timestamp: new Date(),
            value,
            label: `${value}`,
          },
        ],
      };
    });

    // Show toast for critical changes
    if (event.payload?.manual) {
      addToast(
        `🎯 ${event.type} manually overridden`,
        'warning',
        3000
      );
    } else if (
      event.type === 'temperature' &&
      (event.payload?.outdoor > 35 || event.payload?.outdoor < 5)
    ) {
      addToast(
        `⚠️ Temperature critical: ${event.payload?.outdoor}°C`,
        'error',
        5000
      );
    } else if (
      event.type === 'watering' &&
      event.payload?.soilMoisture < 20
    ) {
      addToast(
        `💧 Plants urgently need water: ${event.payload?.soilMoisture}%`,
        'warning',
        5000
      );
    }

    // Check automation rules
    checkAutomationRules(event);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSim();
      setSimulating(false);
      addToast('🛑 Simulation stopped', 'info');
    } else {
      startSim();
      setSimulating(true);
      addToast('▶️ Simulation started', 'success');
    }
  };

  const handleContextOverride = (contextType: string, action: string) => {
    switch (action) {
      case 'on':
      case 'true':
        setOverride({ context: contextType, value: true });
        addToast(`✓ ${contextType} enabled`, 'success');
        break;
      case 'off':
      case 'false':
        setOverride({ context: contextType, value: false });
        addToast(`✕ ${contextType} disabled`, 'success');
        break;
      case 'auto':
        setOverride({ context: contextType, value: null });
        addToast(`🔄 ${contextType} returned to automatic`, 'info');
        break;
    }
  };

  const temperature = contextState?.temperature?.outdoor || 22;
  const tempStatus =
    temperature < 15
      ? 'critical'
      : temperature < 22
      ? 'normal'
      : temperature < 28
      ? 'normal'
      : 'critical';

  const luminosityStatus =
    (contextState?.luminosity?.brightness || 50) < 20
      ? 'warning'
      : (contextState?.luminosity?.brightness || 50) > 80
      ? 'warning'
      : 'normal';

  const wateringStatus =
    (contextState?.watering?.soilMoisture || 50) < 30
      ? 'critical'
      : (contextState?.watering?.soilMoisture || 50) < 50
      ? 'warning'
      : 'normal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex">
      {/* Sidebar - Activity Feed */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="w-80 border-r border-gray-700 hidden xl:block h-screen overflow-hidden"
        >
          <ActivityFeed maxItems={15} />
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-gray-900 to-gray-900/50 backdrop-blur border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-white">XADAPT Dashboard</h1>
                <p className="text-xs text-gray-400">Real-time context management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isSimulating
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {isSimulating ? '● Live' : '○ Idle'}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleSimulation}
                className={`p-2 rounded-lg font-semibold transition-all ${
                  isSimulating
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                {isSimulating ? <Pause size={20} /> : <Play size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`p-2 rounded-lg font-semibold transition-all ${
                  toolsOpen
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <Settings size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tools Modal */}
        {toolsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-xl border border-gray-700 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Tools & Analytics</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setToolsOpen(false)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Expanded Tools Grid - 2 columns */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Row 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 rounded-lg border border-yellow-700 p-4"
                  >
                    <SimulationScenes />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gray-800 rounded-lg border border-blue-700 p-4"
                  >
                    <DataExport />
                  </motion.div>

                  {/* Row 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800 rounded-lg border border-purple-700 p-4"
                  >
                    <ContextThresholds />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gray-800 rounded-lg border border-cyan-700 p-4"
                  >
                    <RuleStatistics />
                  </motion.div>

                  {/* Row 3 - New Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 rounded-lg border border-red-700 p-4"
                  >
                    <AlertSystem />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gray-800 rounded-lg border border-cyan-600 p-4"
                  >
                    <TrendPredictor />
                  </motion.div>

                  {/* Row 4 - New Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800 rounded-lg border border-yellow-600 p-4"
                  >
                    <EfficiencyDashboard />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-gray-800 rounded-lg border border-yellow-500 p-4"
                  >
                    <FavoritesPanel />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Grid */}
        <div className="p-6 space-y-6">
          {/* Context Cards Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Live Contexts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Temperature */}
              <ContextCardPro
                title="Temperature"
                icon={<Thermometer />}
                color="text-blue-400"
                value={temperature.toFixed(1)}
                unit="°C"
                explanation={contextState?.temperature?.explanation}
                status={tempStatus}
                timelineData={timelineData.temperature}
                isManual={contextState?.temperature?.manual}
                onOverrideChange={(action) =>
                  handleContextOverride('temperature', action)
                }
              />

              {/* Luminosity */}
              <ContextCardPro
                title="Luminosity"
                icon={<Sun />}
                color="text-amber-400"
                value={contextState?.luminosity?.brightness || 50}
                unit="%"
                explanation={contextState?.luminosity?.explanation}
                status={luminosityStatus}
                timelineData={timelineData.luminosity}
                isManual={contextState?.luminosity?.manual}
                onOverrideChange={(action) =>
                  handleContextOverride('luminosity', action)
                }
              />

              {/* Watering */}
              <ContextCardPro
                title="Watering"
                icon={<Droplets />}
                color="text-green-400"
                value={contextState?.watering?.soilMoisture || 50}
                unit="%"
                explanation={contextState?.watering?.explanation}
                status={wateringStatus}
                timelineData={timelineData.watering}
                isManual={contextState?.watering?.manual}
                onOverrideChange={(action) =>
                  handleContextOverride('watering', action)
                }
              />

              {/* Silent Mode */}
              <ContextCardPro
                title="Silent Mode"
                icon={<Volume2 />}
                color="text-purple-400"
                value={contextState?.silentMode?.silentMode ? 'ON' : 'OFF'}
                explanation={contextState?.silentMode?.explanation}
                status={contextState?.silentMode?.silentMode ? 'warning' : 'normal'}
                isManual={contextState?.silentMode?.manual}
                onOverrideChange={(action) =>
                  handleContextOverride('silentMode', action)
                }
              />

              {/* Driving Mode */}
              <ContextCardPro
                title="Driving Mode"
                icon={<Navigation />}
                color="text-red-400"
                value={contextState?.drivingMode?.drivingMode ? 'ACTIVE' : 'OFF'}
                explanation={contextState?.drivingMode?.explanation}
                status={contextState?.drivingMode?.drivingMode ? 'warning' : 'normal'}
                isManual={contextState?.drivingMode?.manual}
                onOverrideChange={(action) =>
                  handleContextOverride('drivingMode', action)
                }
              />

              {/* Movement */}
              <ContextCardPro
                title="Movement"
                icon={<Zap />}
                color="text-yellow-400"
                value={contextState?.movement?.alertsDisabled ? 'DISABLED' : 'ENABLED'}
                explanation={contextState?.movement?.explanation}
                status={contextState?.movement?.alertsDisabled ? 'normal' : 'normal'}
                isManual={contextState?.movement?.manual}
                onOverrideChange={(action) =>
                  handleContextOverride('movement', action)
                }
              />
            </div>
          </div>

          {/* Lower Section - Automation & Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Automation Rules */}
            <Card className="border-blue-700">
              <AutomationRules
                rules={rules}
                onAddRule={(rule) => {
                  createRule(rule, {
                    onSuccess: (newRule: any) => {
                      setRules((prev) => [...prev, newRule as AutomationRule]);
                      addToast(`✓ Rule created: ${rule.name}`, 'success');
                    }
                  });
                }}
                onDeleteRule={(id) => {
                  deleteRule(id, {
                    onSuccess: () => {
                      setRules((prev) => prev.filter((r) => r.id !== id));
                      addToast('✓ Rule deleted', 'success');
                    }
                  });
                }}
                onToggleRule={(id, enabled) => {
                  updateRule({ id, data: { enabled } }, {
                    onSuccess: () => {
                      setRules((prev) =>
                        prev.map((r) =>
                          r.id === id ? { ...r, enabled } : r
                        )
                      );
                    }
                  });
                }}
              />
            </Card>

            {/* Multi-Device */}
            <Card className="border-green-700">
              <MultiDevice
                devices={devices}
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
                onAddDevice={(device) => {
                  createDevice(device, {
                    onSuccess: (newDevice: any) => {
                      setDevices((prev) => [...prev, newDevice as Device]);
                      addToast(`✓ Device created: ${device.name}`, 'success');
                    }
                  });
                }}
                onRemoveDevice={(id) => {
                  deleteDevice(id, {
                    onSuccess: () => {
                      setDevices((prev) => prev.filter((d) => d.id !== id));
                      addToast('✓ Device deleted', 'success');
                    }
                  });
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPro;
