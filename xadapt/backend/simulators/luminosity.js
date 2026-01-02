const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');
const { getOverrides } = require('../utils/overrides');

const intervals = new Map();

const simulate = (userId) => {
  const overrides = getOverrides(userId);
  if (overrides.luminosity) return;
  const hour = new Date().getHours();
  let base = 500;
  if (hour >= 6 && hour < 18) base = 800 + Math.random() * 400;
  else base = 50 + Math.random() * 100;

  const clouds = Math.random() > 0.8 ? 0.5 : 1;
  const lux = Math.round(base * clouds);
  
  // Convert lux to percentage (0-100)
  const brightness = Math.min(100, Math.round((lux / 1000) * 100));

  const payload = {
    brightness,
    luminosity: lux,
    environment: brightness > 70 ? 'bright' : brightness > 30 ? 'moderate' : 'dark',
    action: brightness < 15 ? 'Turning on lights' : null
  };

  let explanation = '';
  if (brightness < 15) {
    explanation = `Lights turned on automatically — only ${lux} lux detected (${brightness}% brightness)`;
  } else if (brightness > 70) {
    explanation = `Bright daylight (${lux} lux) — ${brightness}% brightness — lights turned off to save energy`;
  } else {
    explanation = `Moderate lighting (${lux} lux) — ${brightness}% brightness — ${payload.environment} environment`;
  }

  ContextEvent.create({ userId, type: 'luminosity', payload, explanation }).catch(() => {});
  emit(userId, 'luminosity', { ...payload, explanation });
  setState(userId, 'luminosity', { ...payload, explanation });
};

module.exports = {
  start: (userId) => {
    if (intervals.has(userId)) return;
    simulate(userId);
    const id = setInterval(() => simulate(userId), 20000 + Math.random() * 40000);
    intervals.set(userId, id);
  },
  stop: (userId) => {
    const id = intervals.get(userId);
    if (id) clearInterval(id);
    intervals.delete(userId);
  }
};