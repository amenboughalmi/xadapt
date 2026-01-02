import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Filter,
  Clock,
  ChevronDown,
  Search,
} from 'lucide-react';

import { useAuthStore } from '../store';
import { useEvents } from '../hooks/queries';
import Card from '../components/common/Card.tsx';
import Button from '../components/common/Button.tsx';
import Input from '../components/common/Input.tsx';
import type { ContextType } from '../types';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [selectedType, setSelectedType] = useState<ContextType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: eventsData, isLoading } = useEvents(100, selectedType === 'all' ? undefined : selectedType);

  const contextTypes: (ContextType | 'all')[] = [
    'all',
    'temperature',
    'drivingMode',
    'silentMode',
    'movement',
    'watering',
    'luminosity',
  ];

  const contextColors: Record<ContextType | 'all', string> = {
    all: 'from-gray-400 to-gray-600',
    temperature: 'from-blue-400 to-cyan-600',
    drivingMode: 'from-purple-400 to-indigo-600',
    silentMode: 'from-slate-400 to-slate-600',
    movement: 'from-orange-400 to-red-500',
    watering: 'from-green-400 to-emerald-600',
    luminosity: 'from-yellow-400 to-amber-600',
  };

  const contextEmojis: Record<ContextType | 'all', string> = {
    all: '📊',
    temperature: '🌡️',
    drivingMode: '🚗',
    silentMode: '🔇',
    movement: '📍',
    watering: '💧',
    luminosity: '☀️',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEvents = eventsData?.events?.filter((event) =>
    event.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    JSON.stringify(event.payload).toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const eventVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 via-light-100 to-light-50 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-80 h-80 bg-teal-900/5 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      <motion.div
        className="relative z-10 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <header className="bg-white/40 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.button
              variants={itemVariants}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors group"
            >
              <ArrowLeft size={20} className="text-teal-900 group-hover:scale-110 transition-transform" />
              <span className="font-poppins font-600 text-teal-900">Back to Dashboard</span>
            </motion.button>

            <motion.div className="flex items-center gap-4" variants={itemVariants}>
              <h1 className="text-2xl font-poppins font-800 text-teal-900">Event History</h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                size="md"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filters Section */}
          <motion.div variants={itemVariants} className="mb-8 space-y-6">
            <Card className="p-6">
              <div className="space-y-5">
                {/* Search */}
                <Input
                  type="text"
                  placeholder="Search events by explanation or payload..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={20} />}
                  fullWidth
                />

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  <span className="text-sm font-poppins font-600 text-teal-900 self-center">Filter by:</span>
                  <motion.div className="flex flex-wrap gap-2">
                    {contextTypes.map((type) => (
                      <motion.button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-poppins font-600 transition-all duration-300 ${
                          selectedType === type
                            ? `bg-gradient-to-r ${contextColors[type]} text-white shadow-glow`
                            : 'bg-white/60 text-teal-900 hover:bg-white/80 border-2 border-light-100'
                        }`}
                      >
                        <span className="text-lg">{contextEmojis[type]}</span>
                        <span className="capitalize">{type}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 pt-4 border-t border-light-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-poppins font-500 text-gray-600">Total Events:</span>
                    <span className="text-lg font-poppins font-700 text-primary">
                      {eventsData?.total || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-poppins font-500 text-gray-600">Displayed:</span>
                    <span className="text-lg font-poppins font-700 text-primary">
                      {filteredEvents.length}
                    </span>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Events List */}
          <motion.div variants={itemVariants}>
            {isLoading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Filter size={40} className="text-primary" />
                </motion.div>
                <p className="mt-4 text-gray-600 font-poppins font-500">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 font-poppins font-500 text-lg">
                  {searchQuery ? 'No events found matching your search.' : 'No events yet. Start the simulation to see events.'}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event._id || index}
                      variants={eventVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                    >
                      <motion.div
                        onClick={() => setExpandedId(expandedId === event._id ? null : event._id)}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card
                          hoverable
                          className={`bg-gradient-to-r ${contextColors[event.type]} text-white p-5 transition-all duration-300`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-3xl">{contextEmojis[event.type]}</div>
                              <div className="flex-1">
                                <h3 className="text-lg font-poppins font-700 capitalize">
                                  {event.type}
                                </h3>
                                <p className="text-sm opacity-80 font-poppins font-400 truncate">
                                  {event.explanation}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right hidden md:block">
                                <div className="flex items-center gap-1 text-sm opacity-80 font-poppins font-500">
                                  <Clock size={16} />
                                  {new Date(event.createdAt).toLocaleTimeString()}
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedId === event._id ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown size={20} />
                              </motion.div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedId === event._id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-5 pt-5 border-t border-white/30 space-y-4"
                              >
                                <div>
                                  <h4 className="text-sm font-poppins font-600 opacity-80 mb-2">Details</h4>
                                  <p className="text-sm font-poppins font-400 opacity-90">
                                    {event.explanation}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-poppins font-600 opacity-80 mb-2">Payload</h4>
                                  <pre className="bg-black/20 p-3 rounded-lg text-xs overflow-auto max-h-48 backdrop-blur-sm">
                                    <code className="font-mono opacity-90">
                                      {JSON.stringify(event.payload, null, 2)}
                                    </code>
                                  </pre>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs opacity-80">
                                  <span>ID: {event._id?.slice(-8)}</span>
                                  <span>
                                    {new Date(event.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Pagination Info */}
          {!isLoading && filteredEvents.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center mt-8 p-4 bg-white/40 rounded-lg backdrop-blur-sm"
            >
              <p className="text-gray-700 font-poppins font-500 text-sm">
                Showing {filteredEvents.length} of {eventsData?.total || 0} events
              </p>
            </motion.div>
          )}
        </main>
      </motion.div>
    </div>
  );
};

export default Events;
