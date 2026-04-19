const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { validateEvent, validateBulkEvents } = require('../middlewares/validate');
const rateLimiter = require('../middlewares/rateLimiter');

router.post('/', rateLimiter, validateEvent, eventsController.ingestEvent);
router.post('/bulk', rateLimiter, validateBulkEvents, eventsController.ingestBulkEvents);

module.exports = router;
