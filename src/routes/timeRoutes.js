const express = require('express');
const { getTimeByTimezone } = require('../controllers/timeController');
const validateTimezone = require('../utils/validateTimezone');

const router = express.Router();

router.get('/time/:timezone', validateTimezone, getTimeByTimezone);

module.exports = router;
