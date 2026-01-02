const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');
const { getOverrides } = require('../utils/overrides');

let currentTemp = 22;
const intervals = new Map();

const simulate = (userId) => {
  const overrides = getOverrides(userId);
  if (overrides.temperature) return;
  const delta = (Math.random() - 0.5) * 4;
  currentTemp = Math.max(10, Math.min(35, currentTemp + delta));

  const payload = {
    outdoor: parseFloat(currentTemp.toFixed(1)),
    indoor: currentTemp < 18 ? currentTemp + 3 : currentTemp > 28 ? currentTemp - 3 : currentTemp
  };

  let explanation = '';
  if (payload.outdoor < 18) {
    explanation = `Heater turned on because outdoor temperature dropped to ${payload.outdoor}°C`;
  } else if (payload.outdoor > 28) {
    explanation = `Air conditioning activated because outdoor temperature rose to ${payload.outdoor}°C`;
  } else {
    explanation = `Comfortable indoor temperature: ${payload.indoor}°C (outdoor: ${payload.outdoor}°C)`;
  }

  ContextEvent.create({ userId, type: 'temperature', payload, explanation }).catch(() => {});
  emit(userId, 'temperature', { ...payload, explanation });
  setState(userId, 'temperature', { ...payload, explanation });
};

module.exports = {
  start: (userId) => {
    if (intervals.has(userId)) return;
    simulate(userId);
    const id = setInterval(() => simulate(userId), 15000 + Math.random() * 30000);
    intervals.set(userId, id);
  },
  stop: (userId) => {
    const id = intervals.get(userId);
    if (id) clearInterval(id);
    intervals.delete(userId);
  }
};