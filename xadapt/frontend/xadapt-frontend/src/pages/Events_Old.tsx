import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter } from 'lucide-react';

import { useAuthStore } from '../store';
import { useEvents } from '../hooks/queries';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import type { ContextType } from '../types';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [selectedType, setSelectedType] = useState<ContextType | 'all'>('all');
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
    all: 'bg-gray-700',
    temperature: 'bg-blue-700',
    drivingMode: 'bg-red-700',
    silentMode: 'bg-purple-700',
    movement: 'bg-yellow-700',
    watering: 'bg-green-700',
    luminosity: 'bg-amber-700',
  };

  const contextIcons: Record<ContextType | 'all', string> = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} />
              Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-white">Event History</h1>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Filter Events</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {contextTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedType === type
                      ? `${contextColors[type]} text-white shadow-lg`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{contextIcons[type]}</span>
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {isLoading ? (
            <Card>
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 mt-3">Loading events...</p>
              </div>
            </Card>
          ) : eventsData?.events && eventsData.events.length > 0 ? (
            <div className="space-y-3">
              {eventsData.events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`border-l-4 ${
                    event.type === 'temperature'
                      ? 'border-l-blue-500'
                      : event.type === 'drivingMode'
                      ? 'border-l-red-500'
                      : event.type === 'silentMode'
                      ? 'border-l-purple-500'
                      : event.type === 'movement'
                      ? 'border-l-yellow-500'
                      : event.type === 'watering'
                      ? 'border-l-green-500'
                      : 'border-l-amber-500'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{contextIcons[event.type as ContextType]}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {new Date(event.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.type === 'temperature'
                          ? 'bg-blue-900/30 text-blue-300'
                          : event.type === 'drivingMode'
                          ? 'bg-red-900/30 text-red-300'
                          : event.type === 'silentMode'
                          ? 'bg-purple-900/30 text-purple-300'
                          : event.type === 'movement'
                          ? 'bg-yellow-900/30 text-yellow-300'
                          : event.type === 'watering'
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-amber-900/30 text-amber-300'
                      }`}>
                        {event.type}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{event.explanation}</p>
                    <div className="bg-gray-800/50 rounded p-3 text-sm">
                      <p className="text-gray-400 font-mono">
                        {JSON.stringify(event.payload, null, 2)}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No events found</p>
                <p className="text-gray-500 mt-2">
                  Start a simulation to generate context events
                </p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Event Count */}
        {eventsData?.total && (
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Showing {eventsData.events.length} of {eventsData.total} events
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
