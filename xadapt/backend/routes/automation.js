const express = require('express');
const AutomationRule = require('../models/AutomationRule');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all rules for user
router.get('/', auth, async (req, res) => {
  try {
    const rules = await AutomationRule.findAll({ where: { userId: req.user.id } });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create rule
router.post('/', auth, async (req, res) => {
  try {
    const rule = await AutomationRule.create({
      userId: req.user.id,
      ...req.body,
      triggerCount: 0
    });
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update rule
router.put('/:id', auth, async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    
    await rule.update({ ...req.body, updatedAt: new Date() });
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete rule
router.delete('/:id', auth, async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    
    await rule.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update trigger count (when rule triggers)
router.patch('/:id/trigger', auth, async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    
    await rule.update({
      lastTriggered: new Date(),
      triggerCount: rule.triggerCount + 1
    });
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
