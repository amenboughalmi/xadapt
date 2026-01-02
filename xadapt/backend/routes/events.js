// backend/routes/events.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const ContextEvent = require('../models/ContextEvent');

// GET /api/events (frontend expects this)
router.get('/', auth, async (req, res) => {
  const userId = req.user.id;
  const { limit = 50, skip = 0, type } = req.query;

  try {
    const where = { userId };
    if (type) where.type = type;

    const events = await ContextEvent.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: parseInt(skip),
      limit: parseInt(limit)
    });

    const total = await ContextEvent.count({ where });

    res.json({
      events,
      pagination: { total, skip: parseInt(skip), limit: parseInt(limit) }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/events/history (alternative endpoint)
router.get('/history', auth, async (req, res) => {
  const userId = req.user.id;
  const { limit = 50, skip = 0, type } = req.query;

  try {
    const where = { userId };
    if (type) where.type = type;

    const events = await ContextEvent.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: parseInt(skip),
      limit: parseInt(limit)
    });

    const total = await ContextEvent.count({ where });

    res.json({
      events,
      pagination: { total, skip: parseInt(skip), limit: parseInt(limit) }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
