const express = require('express');
const { getTimeByTimezone, getTimeByUtcOffset, getTimeByGmtOffset } = require('../controllers/timeController');
const { validateTimezone, validateGmtOffset } = require('../utils/validateTimezone');

const router = express.Router();

router.get('/time/:timezone', validateTimezone, getTimeByTimezone);
router.get('/time/utc-offset/:utcOffset', getTimeByUtcOffset);
router.get('/time/gmt-offset/:gmtOffset', validateGmtOffset, getTimeByGmtOffset);

module.exports = router;
