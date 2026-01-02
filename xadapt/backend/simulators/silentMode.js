const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');
const { getOverrides } = require('../utils/overrides');

const locations = ['home', 'office', 'cinema', 'library'];
const intervals = new Map();

const simulate = (userId) => {
  const overrides = getOverrides(userId);
  if (overrides.silentMode) return;
  const now = new Date();
  const hour = now.getHours();
  let location;

  if (hour >= 18 && hour < 23) location = 'cinema';
  else if (hour >= 9 && hour < 17) location = Math.random() > 0.5 ? 'office' : 'library';
  else location = 'home';

  const silentMode = ['cinema', 'library'].includes(location);
  const payload = { location, silentMode };

  const explanation = silentMode
    ? `Silent mode activated at ${location} to avoid disturbance`
    : `Silent mode turned off — you're now at ${location}`;

  ContextEvent.create({ userId, type: 'silentMode', payload, explanation }).catch(() => {});
  emit(userId, 'silentMode', { ...payload, explanation });
  setState(userId, 'silentMode', { ...payload, explanation });
};

module.exports = {
  start: (userId) => {
    if (intervals.has(userId)) return;
    simulate(userId);
    const id = setInterval(() => simulate(userId), 120000 + Math.random() * 180000);
    intervals.set(userId, id);
  },
  stop: (userId) => {
    const id = intervals.get(userId);
    if (id) clearInterval(id);
    intervals.delete(userId);
  }
};