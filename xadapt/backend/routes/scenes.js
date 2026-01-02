const express = require('express');
const SimulationScene = require('../models/SimulationScene');
const auth = require('../middleware/auth');

const router = express.Router();

// Predefined scenes
const PRESET_SCENES = {
  hotDay: {
    name: 'Hot Day',
    description: 'Simulate a hot summer day',
    contexts: {
      temperature: { outdoor: 35, explanation: 'Hot summer day' },
      luminosity: { brightness: 85, explanation: 'Bright sunlight' },
      watering: { soilMoisture: 25, explanation: 'Dry soil' }
    }
  },
  coldDay: {
    name: 'Cold Day',
    description: 'Simulate a cold winter day',
    contexts: {
      temperature: { outdoor: 2, explanation: 'Cold winter day' },
      luminosity: { brightness: 30, explanation: 'Dim overcast' },
      watering: { soilMoisture: 60, explanation: 'Moist from rain' }
    }
  },
  rainyDay: {
    name: 'Rainy Day',
    description: 'Simulate a rainy day',
    contexts: {
      temperature: { outdoor: 15, explanation: 'Cool and rainy' },
      luminosity: { brightness: 20, explanation: 'Heavy clouds' },
      watering: { soilMoisture: 80, explanation: 'Very wet from rain' }
    }
  },
  dryDay: {
    name: 'Dry Day',
    description: 'Simulate drought conditions',
    contexts: {
      temperature: { outdoor: 32, explanation: 'Hot and dry' },
      luminosity: { brightness: 90, explanation: 'Intense sun' },
      watering: { soilMoisture: 10, explanation: 'Severe drought' }
    }
  },
  normal: {
    name: 'Normal Day',
    description: 'Return to normal conditions',
    contexts: {
      temperature: { outdoor: 22, explanation: 'Pleasant day' },
      luminosity: { brightness: 50, explanation: 'Moderate light' },
      watering: { soilMoisture: 50, explanation: 'Optimal moisture' }
    }
  }
};

// Get preset scenes
router.get('/presets', (req, res) => {
  res.json(Object.entries(PRESET_SCENES).map(([id, scene]) => ({
    id,
    ...scene
  })));
});

// Get all saved scenes for user
router.get('/', auth, async (req, res) => {
  try {
    const scenes = await SimulationScene.findAll({ where: { userId: req.user.id } });
    res.json(scenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create custom scene
router.post('/', auth, async (req, res) => {
  try {
    const scene = await SimulationScene.create({
      userId: req.user.id,
      ...req.body
    });
    res.status(201).json(scene);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete custom scene
router.delete('/:id', auth, async (req, res) => {
  try {
    const scene = await SimulationScene.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!scene) return res.status(404).json({ error: 'Scene not found' });
    
    await scene.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

module.exports = router;
