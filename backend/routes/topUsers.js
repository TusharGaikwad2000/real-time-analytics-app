const express = require('express');
const router = express.Router();
const topUsersController = require('../controllers/topUsersController');

router.get('/', topUsersController.getTopUsers);

module.exports = router;
