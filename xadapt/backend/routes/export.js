const express = require('express');
const ContextEvent = require('../models/ContextEvent');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Export events as CSV
router.get('/csv', auth, async (req, res) => {
  try {
    const events = await ContextEvent.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    let csv = 'Type,Value,Explanation,Timestamp\n';
    events.forEach(event => {
      const value = JSON.stringify(event.payload).replace(/"/g, '""');
      const explanation = (event.explanation || '').replace(/"/g, '""');
      csv += `${event.type},"${value}","${explanation}",${event.createdAt.toISOString()}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="context-events.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export events as JSON
router.get('/json', auth, async (req, res) => {
  try {
    const events = await ContextEvent.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="context-events.json"');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events for date range
router.get('/', auth, async (req, res) => {
  try {
    const { start, end, type } = req.query;
    const where = { userId: req.user.id };

    if (start || end) {
      where.createdAt = {};
      if (start) where.createdAt[Op.gte] = new Date(start);
      if (end) where.createdAt[Op.lte] = new Date(end);
    }

    if (type) where.type = type;

    const events = await ContextEvent.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 500
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
