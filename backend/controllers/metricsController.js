const { Metric, Event, sequelize } = require('../models');
const { Op } = require('sequelize');
const cacheService = require('../services/cacheService');

const getMetrics = async (req, res) => {
  const { platform } = req.query;
  if (!platform) return res.status(400).json({ error: 'Platform is required' });

  const cacheKey = `metrics_${platform}`;
  const cached = cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const metric = await Metric.findByPk(platform);
    if (!metric) {
      const emptyResult = {
        totalEvents: 0,
        totalRevenue: 0,
        actionBreakdown: {},
        uniqueUsers: 0
      };
      return res.json(emptyResult);
    }

    const defaultBreakdown = { view: 0, click: 0, add_to_cart: 0, purchase: 0 };
    const response = {
      totalEvents: metric.totalEvents,
      totalRevenue: metric.totalRevenue,
      actionBreakdown: { ...defaultBreakdown, ...(metric.actionBreakdown || {}) },
      uniqueUsers: metric.uniqueUsers ? metric.uniqueUsers.length : 0
    };

    cacheService.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

const getWindowMetrics = async (req, res) => {
  const { platform, minutes } = req.query;
  if (!platform || !minutes) return res.status(400).json({ error: 'Platform and minutes are required' });

  const cacheKey = `window_${platform}_${minutes}`;
  const cached = cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const pastTimestamp = Math.floor(Date.now() / 1000) - (parseInt(minutes) * 60);

    const metrics = await Event.findAll({
      where: {
        platform,
        timestamp: { [Op.gte]: pastTimestamp }
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalEvents'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
        [sequelize.fn('array_agg', sequelize.literal('DISTINCT user_id')), 'uniqueUsers'],
        [sequelize.fn('jsonb_object_agg', sequelize.col('action'), 1), 'actions'] // This needs manual breakdown adjustment
      ],
      raw: true
    });

    // Since SQL jsonb_object_agg doesn't sum counts directly here without a subquery, 
    // let's do a simple count for the window query for better readability and correctness.
    const rawEvents = await Event.findAll({
      where: {
        platform,
        timestamp: { [Op.gte]: pastTimestamp }
      },
      attributes: ['action', 'amount', 'userId'],
      raw: true
    });

    const breakdown = {};
    const users = new Set();
    let revenue = 0;

    rawEvents.forEach(e => {
      breakdown[e.action] = (breakdown[e.action] || 0) + 1;
      users.add(e.userId);
      if (e.action === 'purchase') revenue += (e.amount || 0);
    });

    const defaultBreakdown = { view: 0, click: 0, add_to_cart: 0, purchase: 0 };
    const response = {
      totalEvents: rawEvents.length,
      totalRevenue: revenue,
      actionBreakdown: { ...defaultBreakdown, ...breakdown },
      uniqueUsers: users.size
    };

    cacheService.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Window Metrics Error:', error);
    res.status(500).json({ error: 'Failed to fetch window metrics' });
  }
};

module.exports = {
  getMetrics,
  getWindowMetrics
};
