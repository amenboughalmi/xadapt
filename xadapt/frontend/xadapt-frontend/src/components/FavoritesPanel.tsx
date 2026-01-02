import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, X } from 'lucide-react';

interface Favorite {
  id: string;
  type: 'preset' | 'rule' | 'scene';
  name: string;
  description: string;
  action: () => void;
}

const FavoritesPanel: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('xadapt-favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavorites(parsed.map((fav: any) => ({
          ...fav,
          action: () => console.log('Executing', fav.name),
        })));
      } catch (e) {
        console.error('Failed to load favorites');
      }
    } else {
      // Initialize with some default favorites
      setDefaults();
    }
  }, []);

  const setDefaults = () => {
    const defaultFavorites: Favorite[] = [
      {
        id: 'normal-day',
        type: 'scene',
        name: 'Normal Day',
        description: 'Return to baseline conditions',
        action: () => console.log('Loading normal day'),
      },
      {
        id: 'energy-saver',
        type: 'preset',
        name: 'Energy Saver',
        description: 'Minimize all consumption',
        action: () => console.log('Activating energy saver'),
      },
    ];
    setFavorites(defaultFavorites);
    localStorage.setItem('xadapt-favorites', JSON.stringify(defaultFavorites));
  };

  const addFavorite = (name: string, description: string) => {
    const newFavorite: Favorite = {
      id: `fav-${Date.now()}`,
      type: 'preset',
      name,
      description,
      action: () => console.log('Executing', name),
    };
    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    localStorage.setItem('xadapt-favorites', JSON.stringify(updated.map(({ action, ...rest }) => rest)));
    setShowAddMenu(false);
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('xadapt-favorites', JSON.stringify(updated.map(({ action, ...rest }) => rest)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star size={24} className="text-yellow-400 fill-yellow-400" />
          Quick Access
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="p-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Add Favorite Menu */}
      {showAddMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gray-800 border border-yellow-600/50 space-y-3"
        >
          <input
            type="text"
            placeholder="Favorite name..."
            maxLength={30}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                addFavorite(e.currentTarget.value, 'Quick preset');
                e.currentTarget.value = '';
              }
            }}
          />
          <p className="text-xs text-gray-400">Press Enter to add or create one from current state</p>
        </motion.div>
      )}

      {/* Favorites Grid */}
      <div className="grid grid-cols-2 gap-3">
        {favorites.map((fav, idx) => (
          <motion.button
            key={fav.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fav.action}
            className="relative p-4 rounded-lg bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border border-yellow-600/50 hover:border-yellow-500 text-white text-left transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-900/50 text-red-400"
              >
                <X size={14} />
              </motion.button>
            </div>
            <p className="font-semibold text-sm">{fav.name}</p>
            <p className="text-xs text-gray-300 mt-1">{fav.description}</p>
          </motion.button>
        ))}

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="col-span-2 p-6 text-center rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400">
            <p className="text-sm">No favorites yet</p>
            <p className="text-xs mt-1">Click + to add quick access presets</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700 text-xs text-yellow-300">
        <p>⭐ <strong>{favorites.length}</strong> quick presets saved</p>
        <p>💾 Synced to browser storage</p>
      </div>
    </div>
  );
};

export default FavoritesPanel;
