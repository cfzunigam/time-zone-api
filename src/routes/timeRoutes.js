const express = require('express');
const { getTime } = require('../controllers/timeController');
const { validateTimeParam } = require('../utils/validateTimezone');

const router = express.Router();

router.get('/time', validateTimeParam, getTime);

module.exports = router;
