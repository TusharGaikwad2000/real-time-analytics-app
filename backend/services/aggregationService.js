const { Metric, UserTotal, sequelize } = require('../models');

const processEvent = async (event) => {
  const t = await sequelize.transaction();
  try {
    const { platform, action, amount, userId } = event;

    // 1. Update Platform Metrics
    const [metric, created] = await Metric.findOrCreate({
      where: { platform },
      defaults: {
        totalEvents: 1,
        totalRevenue: action === 'purchase' ? amount : 0,
        actionBreakdown: { [action]: 1 },
        uniqueUsers: [userId]
      },
      transaction: t
    });

    if (!created) {
      const breakdown = { ...(metric.actionBreakdown || {}) };
      breakdown[action] = (breakdown[action] || 0) + 1;

      const users = new Set(metric.uniqueUsers || []);
      users.add(userId);

      await metric.update({
        totalEvents: metric.totalEvents + 1,
        totalRevenue: metric.totalRevenue + (action === 'purchase' ? amount : 0),
        actionBreakdown: breakdown,
        uniqueUsers: Array.from(users)
      }, { transaction: t });
    }

    // 2. Update User Totals (only for purchases)
    if (action === 'purchase') {
      const [userTotal, utCreated] = await UserTotal.findOrCreate({
        where: { userId, platform },
        defaults: { totalAmount: amount },
        transaction: t
      });

      if (!utCreated) {
        await userTotal.update({
          totalAmount: userTotal.totalAmount + amount
        }, { transaction: t });
      }
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const processBulkEvents = async (events) => {
  // For simplicity processing one by one in this assignment, 
  // though for massive scaling a worker/queue approach would be better.
  for (const event of events) {
    await processEvent(event);
  }
};

module.exports = {
  processEvent,
  processBulkEvents
};
