const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');
const { getOverrides } = require('../utils/overrides');

const intervals = new Map();

const simulate = (userId) => {
  const overrides = getOverrides(userId);
  if (overrides.drivingMode) return;
  const speed = Math.random() * 120;
  const drivingMode = speed > 30;
  const payload = {
    speed: Math.round(speed),
    drivingMode
  };

  const explanation = drivingMode
    ? `Driving mode activated at ${payload.speed} km/h — phone on Do Not Disturb`
    : `Driving mode off — speed: ${payload.speed} km/h`;

  ContextEvent.create({ userId, type: 'drivingMode', payload, explanation }).catch(() => {});
  emit(userId, 'drivingMode', { ...payload, explanation });
  setState(userId, 'drivingMode', { ...payload, explanation });
};

module.exports = {
  start: (userId) => {
    if (intervals.has(userId)) return;
    simulate(userId);
    const id = setInterval(() => simulate(userId), 8000 + Math.random() * 10000);
    intervals.set(userId, id);
  },
  stop: (userId) => {
    const id = intervals.get(userId);
    if (id) clearInterval(id);
    intervals.delete(userId);
  }
};