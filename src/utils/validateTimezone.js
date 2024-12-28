const { DateTime } = require('luxon');

const validateTimezone = (req, res, next) => {
  const { timezone } = req.params;

  if (!DateTime.now().setZone(timezone).isValid) {
    return res.status(400).json({
      error: 'Invalid timezone format',
      validFormat: 'Example: America/New_York'
    });
  }

  next();
};

module.exports = validateTimezone;
