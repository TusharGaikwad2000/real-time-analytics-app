const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.get('/', metricsController.getMetrics);
router.get('/window', metricsController.getWindowMetrics);

module.exports = router;
