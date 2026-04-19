const { UserTotal } = require('../models');
const cacheService = require('../services/cacheService');

const getTopUsers = async (req, res) => {
  const { platform, k = 5 } = req.query;
  if (!platform) return res.status(400).json({ error: 'Platform is required' });

  const cacheKey = `topusers_${platform}_${k}`;
  const cached = cacheService.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const topUsers = await UserTotal.findAll({
      where: { platform },
      order: [['totalAmount', 'DESC']],
      limit: parseInt(k),
      attributes: ['userId', 'totalAmount']
    });

    const response = {
      platform,
      topUsers
    };

    cacheService.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top users' });
  }
};

module.exports = {
  getTopUsers
};
