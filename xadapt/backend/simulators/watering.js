const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');
const { getOverrides } = require('../utils/overrides');

const intervals = new Map();
const moisture = new Map();
const plantHealth = new Map();

const simulate = (userId) => {
  const overrides = getOverrides(userId);
  if (overrides.watering) return;
  let current = moisture.get(userId) || 70;
  let health = plantHealth.get(userId) || 100;
  
  current = Math.max(0, current - (Math.random() * 3));
  
  // Health decreases if moisture is too low or too high
  if (current < 20) {
    health = Math.max(0, health - 2);
  } else if (current > 85) {
    health = Math.max(0, health - 1);
  } else if (current < 30 || current > 75) {
    health = Math.min(100, health + 0.5);
  } else {
    health = Math.min(100, health + 1);
  }
  
  moisture.set(userId, current);
  plantHealth.set(userId, health);

  const watering = current < 30;
  const payload = {
    soilMoisture: Math.round(current),
    plantHealth: Math.round(health),
    watering,
    healthStatus: health > 80 ? 'excellent' : health > 60 ? 'good' : health > 40 ? 'fair' : 'poor',
    message: watering ? 'Plants need water!' : 'Soil is okay'
  };

  let explanation = watering
    ? `Plants are being watered — soil moisture was only ${payload.soilMoisture}% (Plant Health: ${payload.healthStatus})`
    : `Soil is healthy at ${payload.soilMoisture}% moisture — Plant Health: ${payload.healthStatus} (${payload.plantHealth}%)`;

  ContextEvent.create({ userId, type: 'watering', payload, explanation }).catch(() => {});
  emit(userId, 'watering', { ...payload, explanation });
  setState(userId, 'watering', { ...payload, explanation });
};

module.exports = {
  start: (userId) => {
    if (intervals.has(userId)) return;
    moisture.set(userId, 70);
    plantHealth.set(userId, 100);
    simulate(userId);
    const id = setInterval(() => simulate(userId), 300000 + Math.random() * 300000);
    intervals.set(userId, id);
  },
  stop: (userId) => {
    const id = intervals.get(userId);
    if (id) clearInterval(id);
    intervals.delete(userId);
    moisture.delete(userId);
    plantHealth.delete(userId);
  }
};