// backend/routes/context.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const { getState, setState } = require('../utils/state');
const { getOverrides, setOverride, clearOverride } = require('../utils/overrides');
const emit = require('../utils/emit');
const ContextEvent = require('../models/ContextEvent');

router.get('/latest', auth, (req, res) => {
  const state = getState(req.user.id);
  res.json({
    userId: req.user.id,
    updatedAt: new Date(),
    contexts: state,
    tip: "Poll this endpoint every 5s for real-time updates"
  });
});

// GET /api/context/state
router.get('/state', auth, (req, res) => {
  const state = getState(req.user.id);
  res.json({
    success: true,
    state: state,
  });
});

// GET /api/context/overrides
router.get('/overrides', auth, (req, res) => {
  const overrides = getOverrides(req.user.id);
  res.json({
    success: true,
    overrides: overrides,
  });
});

// POST /api/context/overrides - Immediate context update with override
router.post('/overrides', auth, (req, res) => {
  const { context, value } = req.body;
  const userId = req.user.id;
  
  if (!context || value === undefined) {
    return res.status(400).json({ message: 'Missing context or value' });
  }

  // Handle clearing override with null value
  if (value === null) {
    clearOverride(userId, context);
    
    res.json({
      message: 'Override cleared',
      context,
      timestamp: new Date(),
    });
    return;
  }

  setOverride(userId, context, value);
  
  // Create immediate context update event with payload based on context
  let payload = {};
  let explanation = '';
  
  switch(context) {
    case 'temperature':
      payload = { mode: value ? 'heater' : 'ac', manual: true };
      explanation = `Temperature manually set to ${value ? 'heater' : 'AC'} mode`;
      break;
    case 'silentMode':
      payload = { silentMode: value, manual: true };
      explanation = `Silent mode ${value ? 'enabled' : 'disabled'} manually`;
      break;
    case 'lights':
      payload = { lights: value, manual: true };
      explanation = `Lights manually turned ${value ? 'on' : 'off'}`;
      break;
    case 'movement':
      payload = { alertsDisabled: value, manual: true };
      explanation = `Movement alerts manually ${value ? 'disabled' : 're-enabled'}`;
      break;
    case 'drivingMode':
      payload = { drivingMode: value, manual: true };
      explanation = `Driving mode ${value ? 'activated' : 'deactivated'}`;
      break;
    case 'luminosity':
      payload = { brightness: value, manual: true };
      explanation = `Luminosity manually set to ${value}% brightness`;
      break;
    case 'watering':
      payload = { watering: value, manual: true };
      explanation = `Watering manually ${value ? 'started' : 'stopped'}`;
      break;
    default:
      payload = { manual: true };
      explanation = `${context} manually updated`;
  }

  // Store context state
  setState(userId, context, { ...payload, explanation });
  
  // Emit real-time update via socket
  ContextEvent.create({ userId, type: context, payload, explanation }).catch(() => {});
  emit(userId, context, { ...payload, explanation, manual: true });

  res.json({
    message: 'Override set and context updated',
    context,
    value,
    timestamp: new Date(),
  });
});

module.exports = router;