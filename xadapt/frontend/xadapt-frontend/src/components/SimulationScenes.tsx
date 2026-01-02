import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Cloud, Sun, Droplets, Snowflake } from 'lucide-react';
import { usePresetScenes, useSetManualContext } from '../hooks/queries';
import { useToast } from './Toast';

const SimulationScenes: React.FC = () => {
  const { data: presets = [] } = usePresetScenes();
  const { mutate: setContext } = useSetManualContext();
  const { addToast } = useToast();

  const getSceneIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('hot') || lower.includes('dry')) return <Sun className="w-5 h-5 text-orange-400" />;
    if (lower.includes('cold')) return <Snowflake className="w-5 h-5 text-blue-400" />;
    if (lower.includes('rain')) return <Cloud className="w-5 h-5 text-gray-400" />;
    if (lower.includes('water')) return <Droplets className="w-5 h-5 text-blue-400" />;
    return <Play className="w-5 h-5 text-green-400" />;
  };

  const playScene = (scene: any) => {
    if (!scene.contexts) return;
    
    // Apply all contexts from scene
    Object.entries(scene.contexts).forEach(([contextType, data]: [string, any]) => {
      if (data) {
        setContext({ type: contextType, payload: data });
      }
    });

    addToast(`🎬 Loaded scene: ${scene.name}`, 'success', 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Play size={24} className="text-purple-400" />
          Simulation Scenes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {(presets as any[])?.map((scene: any) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSceneIcon(scene.name)}
                  <div>
                    <h3 className="font-semibold text-white text-sm">{scene.name}</h3>
                    <p className="text-xs text-gray-400">{scene.description}</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playScene(scene)}
                className="w-full mt-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Play size={14} />
                Load Scene
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-400 text-center">Click "Load Scene" to apply all context values at once</p>
    </div>
  );
};

export default SimulationScenes;
