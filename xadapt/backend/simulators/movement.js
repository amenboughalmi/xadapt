const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');
const { getOverrides } = require('../utils/overrides');
const intervals = new Map();

const simulate = (userId) => {
  const overrides = getOverrides(userId);
  if (overrides.movement) return;
  const isMoving = Math.random() > 0.7;
  const payload = {
    isMoving,
    alert: isMoving ? 'Movement detected!' : null
  };

  const explanation = isMoving
    ? `Movement detected! Security alert sent`
    : `No movement detected — all calm`;

  ContextEvent.create({ userId, type: 'movement', payload, explanation }).catch(() => {});
  emit(userId, 'movement', { ...payload, explanation });
  setState(userId, 'movement', { ...payload, explanation });
};

module.exports = {
  start: (userId) => {
    if (intervals.has(userId)) return;
    simulate(userId);
    const id = setInterval(() => simulate(userId), 5000 + Math.random() * 15000);
    intervals.set(userId, id);
  },
  stop: (userId) => {
    const id = intervals.get(userId);
    if (id) clearInterval(id);
    intervals.delete(userId);
  }
};