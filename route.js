const express = require('express');


const router = express.Router();

router.get('/time/:timezone');

module.exports = router;