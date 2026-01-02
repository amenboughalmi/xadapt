const router = require('express').Router();
const auth = require('../middleware/auth');

const simulators = {
  temperature: require('../simulators/temperature'),
  silentMode: require('../simulators/silentMode'),
  movement: require('../simulators/movement'),
  drivingMode: require('../simulators/drivingMode'),
  watering: require('../simulators/watering'),
  luminosity: require('../simulators/luminosity')
};

router.post('/start', auth, (req, res) => {
  const userId = req.user.id;
  Object.values(simulators).forEach(s => s.start(userId));
  res.json({ message: 'Simulation started', userId });
});

router.post('/stop', auth, (req, res) => {
  const userId = req.user.id;
  Object.values(simulators).forEach(s => s.stop(userId));
  res.json({ message: 'Simulation stopped', userId });
});

module.exports = router;