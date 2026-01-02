// backend/routes/manual.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const { setOverride, clearOverride, getOverrides } = require('../utils/overrides');
const ContextEvent = require('../models/ContextEvent');
const emit = require('../utils/emit');
const { setState } = require('../utils/state');

const createEvent = (userId, type, payload, explanation) => {
  ContextEvent.create({ userId, type, payload, explanation }).catch(() => {});
  emit(userId, type, { ...payload, explanation, manual: true });
  setState(userId, type, { ...payload, explanation, manual: true });
};

// Generic manual toggle
router.post('/:context', auth, (req, res) => {
  const { context } = req.params;
  const { action } = req.body; // e.g. "on", "off", "auto", "now"
  const userId = req.user.id;

  let payload = {};
  let explanation = '';

  switch (context) {
    case 'temperature':
      if (action === 'heater') { payload.mode = 'heater'; explanation = 'User manually turned on heater'; }
      else if (action === 'ac') { payload.mode = 'ac'; explanation = 'User manually turned on AC'; }
      else { clearOverride(userId, 'temperature'); explanation = 'Temperature control returned to automatic'; }
      break;

    case 'silentMode':
      payload.silentMode = action === 'on';
      explanation = payload.silentMode ? 'User forced silent mode ON' : 'User turned silent mode OFF';
      action === 'auto' && clearOverride(userId, 'silentMode');
      break;

    case 'lights':
      if (action === 'on') { payload.lights = true; explanation = 'User turned lights ON manually'; }
      else if (action === 'off') { payload.lights = false; explanation = 'User turned lights OFF manually'; }
      else { clearOverride(userId, 'lights'); explanation = 'Lights returned to automatic mode'; }
      break;

    case 'watering':
      payload.watering = true;
      explanation = 'User started watering plants manually';
      break;

    case 'movement':
      payload.alertsDisabled = action === 'off';
      explanation = payload.alertsDisabled ? 'User temporarily disabled movement alerts' : 'Movement alerts re-enabled';
      break;

    case 'drivingMode':
      payload.drivingMode = false;
      explanation = 'User disabled driving mode for safety';
      break;

    case 'luminosity':
      if (action === 'auto') {
        clearOverride(userId, 'luminosity');
        explanation = 'Luminosity control returned to automatic';
      } else {
        const percentage = parseInt(action);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          return res.status(400).json({ msg: 'Luminosity must be a percentage (0-100)' });
        }
        payload.brightness = percentage;
        payload.environment = percentage > 70 ? 'bright' : percentage > 30 ? 'moderate' : 'dark';
        explanation = `User set luminosity to ${percentage}% brightness`;
      }
      break;

    default:
      return res.status(400).json({ msg: 'Invalid context' });
  }

  if (action === 'auto') {
    clearOverride(userId, context);
  } else if (context !== 'watering') {
    setOverride(userId, context, payload, explanation);
  }

  createEvent(userId, context, payload, explanation);
  res.json({ success: true, explanation });
});

module.exports = router;