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
} from 'lucide-react';

import { useAuthStore, useContextStore } from '../store';
import {
  useContextState,
  useOverrides,
  useStartSimulation,
  useStopSimulation,
} from '../hooks/queries';
import { useContextUpdate } from '../hooks/socket';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { state: contextState, updateContext, isSimulating, setSimulating } = useContextStore();
  const { data: stateData } = useContextState();
  const { data: overridesData } = useOverrides();
  const { mutate: startSim } = useStartSimulation();
  const { mutate: stopSim } = useStopSimulation();

  const [realTimeUpdate, setRealTimeUpdate] = useState(false);

  // Update context state when data is fetched
  useEffect(() => {
    if (stateData?.state) {
      useContextStore.setState({ state: stateData.state });
    }
  }, [stateData]);

  // Update overrides when data is fetched
  useEffect(() => {
    if (overridesData?.overrides) {
      useContextStore.setState({ overrides: overridesData.overrides });
    }
  }, [overridesData]);

  // Listen for real-time context updates
  useContextUpdate((event) => {
    updateContext(event);
    setRealTimeUpdate(true);
    setTimeout(() => setRealTimeUpdate(false), 500);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSim();
      setSimulating(false);
    } else {
      startSim();
      setSimulating(true);
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { label: 'Cold', color: 'text-blue-400', bg: 'bg-blue-900/20' };
    if (temp < 22) return { label: 'Cool', color: 'text-cyan-400', bg: 'bg-cyan-900/20' };
    if (temp < 28) return { label: 'Comfortable', color: 'text-green-400', bg: 'bg-green-900/20' };
    return { label: 'Hot', color: 'text-red-400', bg: 'bg-red-900/20' };
  };

  const temperature = contextState?.temperature?.outdoor || 22;
  const tempStatus = getTemperatureStatus(temperature);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">X</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">XAdapt</h1>
              <p className="text-xs text-gray-400">Context-Aware Adaptive System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${realTimeUpdate ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                <p className="text-xs text-gray-400">
                  {isSimulating ? 'Simulating' : 'Idle'}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Simulation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Simulation Control</h2>
                <p className="text-gray-400 text-sm">
                  {isSimulating
                    ? 'Simulators are running and generating context events'
                    : 'Start simulators to generate real-time context data'}
                </p>
              </div>
              <Button
                variant={isSimulating ? 'danger' : 'success'}
                size="lg"
                onClick={handleToggleSimulation}
              >
                {isSimulating ? (
                  <>
                    <Pause size={20} /> Stop Simulation
                  </>
                ) : (
                  <>
                    <Play size={20} /> Start Simulation
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Context Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Temperature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className={`relative overflow-hidden ${contextState?.temperature ? 'border-blue-700' : ''}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Thermometer className="text-blue-400" size={20} />
                    Temperature
                  </h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tempStatus.bg} ${tempStatus.color}`}>
                    {tempStatus.label}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {contextState?.temperature?.outdoor?.toFixed(1) || '22'}°C
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.temperature?.explanation || 'No data yet'}
                  </p>
                </div>
                <div className="bg-gray-800 rounded p-3 text-sm">
                  <p className="text-gray-300">
                    Indoor: <span className="text-blue-400 font-semibold">{contextState?.temperature?.indoor?.toFixed(1) || '22'}°C</span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Driving Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className={`relative overflow-hidden ${contextState?.drivingMode ? 'border-red-700' : ''}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Navigation className="text-red-400" size={20} />
                  Driving Mode
                </h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-red-400 mb-2">
                    {contextState?.drivingMode?.speed || 0} km/h
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.drivingMode?.explanation || 'No data yet'}
                  </p>
                </div>
                <div className={`rounded p-3 text-sm font-semibold ${contextState?.drivingMode?.drivingMode ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                  {contextState?.drivingMode?.drivingMode ? '🔴 DND Active' : '🟢 Normal Mode'}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Movement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className={`relative overflow-hidden ${contextState?.movement ? 'border-yellow-700' : ''}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Zap className="text-yellow-400" size={20} />
                  Movement
                </h3>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.movement?.explanation || 'No data yet'}
                  </p>
                </div>
                <div className={`rounded p-3 text-sm font-semibold ${contextState?.movement?.isMoving ? 'bg-yellow-900/30 text-yellow-300' : 'bg-blue-900/30 text-blue-300'}`}>
                  {contextState?.movement?.isMoving ? '📍 Moving' : '📍 Stationary'}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Silent Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className={`relative overflow-hidden ${contextState?.silentMode ? 'border-purple-700' : ''}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Volume2 className="text-purple-400" size={20} />
                  Silent Mode
                </h3>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.silentMode?.explanation || 'No data yet'}
                  </p>
                </div>
                <div className={`rounded p-3 text-sm font-semibold ${contextState?.silentMode?.silentMode ? 'bg-purple-900/30 text-purple-300' : 'bg-gray-700/30 text-gray-300'}`}>
                  {contextState?.silentMode?.silentMode ? '🔇 Silent' : '🔊 Normal'}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Watering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className={`relative overflow-hidden ${contextState?.watering ? 'border-green-700' : ''}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Droplets className="text-green-400" size={20} />
                  Watering
                </h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {contextState?.watering?.soilMoisture || 50}%
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.watering?.explanation || 'No data yet'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Luminosity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className={`relative overflow-hidden ${contextState?.luminosity ? 'border-amber-700' : ''}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-8 -mt-8"></div>
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Sun className="text-amber-400" size={20} />
                  Luminosity
                </h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-amber-400 mb-2">
                    {contextState?.luminosity?.lightLevel || 500} lux
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.luminosity?.explanation || 'No data yet'}
                  </p>
                </div>
                <div className="bg-gray-800 rounded p-3 text-sm">
                  <p className="text-gray-300">
                    Brightness: <span className="text-amber-400 font-semibold">{contextState?.luminosity?.brightness || 'Unknown'}</span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
