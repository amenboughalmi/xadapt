const express = require('express');
const ContextThreshold = require('../models/ContextThreshold');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all thresholds for user
router.get('/', auth, async (req, res) => {
  try {
    const thresholds = await ContextThreshold.findAll({ where: { userId: req.user.id } });
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get thresholds for specific context
router.get('/:context', auth, async (req, res) => {
  try {
    const threshold = await ContextThreshold.findOne({ 
      where: { 
        userId: req.user.id,
        context: req.params.context 
      }
    });
    res.json(threshold || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update threshold
router.put('/:context', auth, async (req, res) => {
  try {
    const [threshold] = await ContextThreshold.findOrCreate({
      where: { userId: req.user.id, context: req.params.context },
      defaults: { ...req.body, updatedAt: new Date() }
    });
    
    if (threshold.userId === req.user.id && req.body) {
      await threshold.update({ ...req.body, updatedAt: new Date() });
    }
    res.json(threshold);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
