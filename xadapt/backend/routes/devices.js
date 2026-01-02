const express = require('express');
const Device = require('../models/Device');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all devices for user
router.get('/', auth, async (req, res) => {
  try {
    const devices = await Device.findAll({ where: { userId: req.user.id } });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create device
router.post('/', auth, async (req, res) => {
  try {
    const device = await Device.create({
      userId: req.user.id,
      ...req.body
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update device
router.put('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    
    await device.update({ ...req.body, lastUpdated: new Date() });
    res.json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete device
router.delete('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    
    await device.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
