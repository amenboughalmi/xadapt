import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  X,
} from 'lucide-react';

import { useAuthStore, useContextStore } from '../store';
import {
  useContextState,
  useOverrides,
  useStartSimulation,
  useStopSimulation,
  useSetOverride,
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
  const { mutate: setOverride } = useSetOverride();

  const [realTimeUpdate, setRealTimeUpdate] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<{ [key: string]: number }>({});
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
    setLastUpdated((prev) => ({ ...prev, [event.type]: Date.now() }));
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

  const handleSetOverride = (context: string, value: any) => {
    setOverride({ context, value });
  };

  const handleClearOverride = (context: string) => {
    setOverride({ context, value: null });
  };

  const isOverrideActive = (context: string) => {
    return !!contextState?.[context]?.manual;
  };

  const isStateRecentlyUpdated = (context: string) => {
    const lastUpdate = lastUpdated[context] || 0;
    return Date.now() - lastUpdate < 1000;
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
            <button
              onClick={() => setShowOverrideModal(true)}
              className="p-2.5 rounded-lg bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 transition-colors"
              title="Override settings"
            >
              <Settings size={20} />
            </button>
            <div className="text-right">
              <p className="text-white font-medium">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${realTimeUpdate ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
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
            <Card className={`relative overflow-hidden transition-all duration-300 ${
              isStateRecentlyUpdated('temperature') ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-blue-700'
            } ${contextState?.temperature ? '' : ''}`}>
              <motion.div
                animate={isStateRecentlyUpdated('temperature') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8"
              />
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
                  <motion.div
                    key={contextState?.temperature?.outdoor}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-blue-400 mb-2"
                  >
                    {contextState?.temperature?.outdoor?.toFixed(1) || '22'}°C
                  </motion.div>
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
            <Card className={`relative overflow-hidden transition-all duration-300 ${
              isStateRecentlyUpdated('drivingMode') ? 'border-red-500 shadow-lg shadow-red-500/50' : 'border-red-700'
            }`}>
              <motion.div
                animate={isStateRecentlyUpdated('drivingMode') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-8 -mt-8"
              />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Navigation className="text-red-400" size={20} />
                  Driving Mode
                </h3>
                <div className="mb-4">
                  <motion.div
                    key={contextState?.drivingMode?.speed}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-red-400 mb-2"
                  >
                    {contextState?.drivingMode?.speed || 0} km/h
                  </motion.div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.drivingMode?.explanation || 'No data yet'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOverride({ context: 'drivingMode', value: true })}
                    className={`flex-1 rounded p-3 text-sm font-semibold transition-all ${
                      overridesData?.overrides?.drivingMode
                        ? 'bg-red-900/50 text-red-300 border border-red-600 shadow-lg shadow-red-500/30'
                        : 'bg-red-900/20 text-red-400 border border-red-900/50 hover:border-red-600'
                    }`}
                  >
                    🔴 DND Active
                  </button>
                  <button
                    onClick={() => setOverride({ context: 'drivingMode', value: false })}
                    className={`flex-1 rounded p-3 text-sm font-semibold transition-all ${
                      !overridesData?.overrides?.drivingMode
                        ? 'bg-green-900/50 text-green-300 border border-green-600 shadow-lg shadow-green-500/30'
                        : 'bg-green-900/20 text-green-400 border border-green-900/50 hover:border-green-600'
                    }`}
                  >
                    🟢 Normal Mode
                  </button>
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
            <Card className={`relative overflow-hidden transition-all duration-300 ${
              isStateRecentlyUpdated('movement') ? 'border-yellow-500 shadow-lg shadow-yellow-500/50' : 'border-yellow-700'
            }`}>
              <motion.div
                animate={isStateRecentlyUpdated('movement') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-8 -mt-8"
              />
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setOverride({ context: 'movement', value: true })}
                    className={`flex-1 rounded p-3 text-sm font-semibold transition-all ${
                      overridesData?.overrides?.movement
                        ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-600 shadow-lg shadow-yellow-500/30'
                        : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/50 hover:border-yellow-600'
                    }`}
                  >
                    📍 Moving
                  </button>
                  <button
                    onClick={() => setOverride({ context: 'movement', value: false })}
                    className={`flex-1 rounded p-3 text-sm font-semibold transition-all ${
                      !overridesData?.overrides?.movement
                        ? 'bg-blue-900/50 text-blue-300 border border-blue-600 shadow-lg shadow-blue-500/30'
                        : 'bg-blue-900/20 text-blue-400 border border-blue-900/50 hover:border-blue-600'
                    }`}
                  >
                    📍 Stationary
                  </button>
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
            <Card className={`relative overflow-hidden transition-all duration-300 ${
              isStateRecentlyUpdated('silentMode') ? 'border-purple-500 shadow-lg shadow-purple-500/50' : 'border-purple-700'
            }`}>
              <motion.div
                animate={isStateRecentlyUpdated('silentMode') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-8 -mt-8"
              />
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setOverride({ context: 'silentMode', value: true })}
                    className={`flex-1 rounded p-3 text-sm font-semibold transition-all ${
                      overridesData?.overrides?.silentMode
                        ? 'bg-purple-900/50 text-purple-300 border border-purple-600 shadow-lg shadow-purple-500/30'
                        : 'bg-purple-900/20 text-purple-400 border border-purple-900/50 hover:border-purple-600'
                    }`}
                  >
                    🔇 Silent
                  </button>
                  <button
                    onClick={() => setOverride({ context: 'silentMode', value: false })}
                    className={`flex-1 rounded p-3 text-sm font-semibold transition-all ${
                      !overridesData?.overrides?.silentMode
                        ? 'bg-gray-700/50 text-gray-300 border border-gray-600 shadow-lg shadow-gray-500/30'
                        : 'bg-gray-700/20 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    🔊 Normal
                  </button>
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
            <Card className={`relative overflow-hidden transition-all duration-300 ${
              isStateRecentlyUpdated('watering') ? 'border-green-500 shadow-lg shadow-green-500/50' : 'border-green-700'
            }`}>
              <motion.div
                animate={isStateRecentlyUpdated('watering') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-8 -mt-8"
              />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Droplets className="text-green-400" size={20} />
                  Watering
                </h3>
                <div className="mb-4">
                  <motion.div
                    key={contextState?.watering?.soilMoisture}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-green-400 mb-2"
                  >
                    {contextState?.watering?.soilMoisture || 50}%
                  </motion.div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.watering?.explanation || 'No data yet'}
                  </p>
                  {/* Progress bar for soil moisture */}
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${contextState?.watering?.soilMoisture || 50}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        (contextState?.watering?.soilMoisture || 50) < 30
                          ? 'bg-red-500'
                          : (contextState?.watering?.soilMoisture || 50) < 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
                {/* Plant health indicator */}
                <div className="bg-gray-800 rounded p-3 mb-3">
                  <p className="text-gray-300 text-sm mb-2">
                    Plant Health: <span className={`font-semibold ${
                      (contextState?.watering?.plantHealth || 100) > 80 ? 'text-green-400' :
                      (contextState?.watering?.plantHealth || 100) > 60 ? 'text-yellow-400' :
                      (contextState?.watering?.plantHealth || 100) > 40 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {contextState?.watering?.healthStatus || 'excellent'} ({contextState?.watering?.plantHealth || 100}%)
                    </span>
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${contextState?.watering?.plantHealth || 100}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        (contextState?.watering?.plantHealth || 100) > 80 ? 'bg-green-500' :
                        (contextState?.watering?.plantHealth || 100) > 60 ? 'bg-yellow-500' :
                        (contextState?.watering?.plantHealth || 100) > 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
                {/* Manual watering button */}
                <button
                  onClick={() => {
                    setOverride({ context: 'watering', value: true });
                  }}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  💧 Water Plants Now
                </button>
              </div>
            </Card>
          </motion.div>

          {/* Luminosity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className={`relative overflow-hidden transition-all duration-300 ${
              isStateRecentlyUpdated('luminosity') ? 'border-amber-500 shadow-lg shadow-amber-500/50' : 'border-amber-700'
            }`}>
              <motion.div
                animate={isStateRecentlyUpdated('luminosity') ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-8 -mt-8"
              />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Sun className="text-amber-400" size={20} />
                  Luminosity
                </h3>
                <div className="mb-4">
                  <motion.div
                    key={contextState?.luminosity?.brightness}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-amber-400 mb-2"
                  >
                    {contextState?.luminosity?.brightness || 50}%
                  </motion.div>
                  <p className="text-gray-400 text-sm mb-3">
                    {contextState?.luminosity?.explanation || 'No data yet'}
                  </p>
                  {/* Brightness progress bar */}
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${contextState?.luminosity?.brightness || 50}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-gray-600 via-amber-500 to-amber-400"
                    />
                  </div>
                </div>
                <div className="bg-gray-800 rounded p-3 mb-3 text-sm">
                  <p className="text-gray-300 mb-2">
                    Environment: <span className="text-amber-400 font-semibold capitalize">{contextState?.luminosity?.environment || 'moderate'}</span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    {contextState?.luminosity?.luminosity || 500} lux
                  </p>
                </div>
                {/* Manual brightness control */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Override Brightness</label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      id="brightness-slider"
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      onChange={(e) => {
                        const value = e.target.value;
                        document.getElementById('brightness-value')!.textContent = value;
                      }}
                    />
                    <span id="brightness-value" className="text-amber-400 font-semibold min-w-max w-12 text-right">50</span>%
                  </div>
                  <button
                    onClick={() => {
                      const value = (document.getElementById('brightness-slider') as HTMLInputElement).value;
                      setOverride({ context: 'luminosity', value: parseInt(value) });
                    }}
                    className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-colors text-sm"
                  >
                    Set Brightness
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Override Modal */}
      <AnimatePresence>
        {showOverrideModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverrideModal(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm flex items-center justify-center"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <Card className="border-blue-500/50 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings size={24} className="text-blue-400" />
                    Override Controls
                  </h2>
                  <button
                    onClick={() => setShowOverrideModal(false)}
                    className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                <p className="text-gray-400 text-sm mb-6">
                  Manually control context states to test system behavior
                </p>

                {/* Temperature Override */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Thermometer size={18} className="text-blue-400" />
                    Temperature
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetOverride('temperature', true)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('temperature') && contextState?.temperature?.mode === 'heater'
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔥 Heater
                    </button>
                    <button
                      onClick={() => handleSetOverride('temperature', false)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('temperature') && contextState?.temperature?.mode === 'ac'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      ❄️ AC
                    </button>
                    <button
                      onClick={() => handleClearOverride('temperature')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        !isOverrideActive('temperature')
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔄 Auto
                    </button>
                  </div>
                </div>

                {/* Silent Mode Override */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Volume2 size={18} className="text-purple-400" />
                    Silent Mode
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetOverride('silentMode', true)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('silentMode') && contextState?.silentMode?.silentMode
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔇 Silent
                    </button>
                    <button
                      onClick={() => handleSetOverride('silentMode', false)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('silentMode') && !contextState?.silentMode?.silentMode
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔊 Normal
                    </button>
                    <button
                      onClick={() => handleClearOverride('silentMode')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        !isOverrideActive('silentMode')
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔄 Auto
                    </button>
                  </div>
                </div>

                {/* Movement Override */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-400" />
                    Movement
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetOverride('movement', false)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('movement') && contextState?.movement?.alertsDisabled
                          ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      📍 Disabled
                    </button>
                    <button
                      onClick={() => handleSetOverride('movement', true)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('movement') && !contextState?.movement?.alertsDisabled
                          ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      📍 Enabled
                    </button>
                    <button
                      onClick={() => handleClearOverride('movement')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        !isOverrideActive('movement')
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔄 Auto
                    </button>
                  </div>
                </div>

                {/* Driving Mode Override */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Navigation size={18} className="text-red-400" />
                    Driving Mode
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetOverride('drivingMode', true)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('drivingMode') && contextState?.drivingMode?.drivingMode
                          ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔴 Active
                    </button>
                    <button
                      onClick={() => handleSetOverride('drivingMode', false)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('drivingMode') && !contextState?.drivingMode?.drivingMode
                          ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🟢 Inactive
                    </button>
                    <button
                      onClick={() => handleClearOverride('drivingMode')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        !isOverrideActive('drivingMode')
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔄 Auto
                    </button>
                  </div>
                </div>

                {/* Watering Override */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Droplets size={18} className="text-green-400" />
                    Watering
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetOverride('watering', true)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('watering') && contextState?.watering?.watering
                          ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      💧 On
                    </button>
                    <button
                      onClick={() => handleSetOverride('watering', false)}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        isOverrideActive('watering') && !contextState?.watering?.watering
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      💧 Off
                    </button>
                    <button
                      onClick={() => handleClearOverride('watering')}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        !isOverrideActive('watering')
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      🔄 Auto
                    </button>
                  </div>
                </div>

                {/* Luminosity Override */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Sun size={18} className="text-amber-400" />
                    Luminosity
                  </h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="50"
                        id="modal-brightness-slider"
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        onChange={(e) => {
                          const value = e.target.value;
                          document.getElementById('modal-brightness-value')!.textContent = value;
                        }}
                      />
                      <span id="modal-brightness-value" className="text-amber-400 font-semibold min-w-max w-12 text-right">50</span>%
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const value = (document.getElementById('modal-brightness-slider') as HTMLInputElement).value;
                          handleSetOverride('luminosity', parseInt(value));
                        }}
                        className="flex-1 py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        ☀️ Set
                      </button>
                      <button
                        onClick={() => handleClearOverride('luminosity')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm ${
                          !isOverrideActive('luminosity')
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        🔄 Auto
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowOverrideModal(false)}
                  className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors mt-6"
                >
                  Close
                </button>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
