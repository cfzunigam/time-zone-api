const { DateTime } = require('luxon');

const getTimeByTimezone = (req, res) => {
  const { timezone } = req.params;

  try {
    const time = DateTime.now().setZone(timezone);

    if (!time.isValid) {
      return res.status(400).json({
        error: 'Invalid timezone format',
        validFormat: 'Example: America/New_York',
      });
    }

    const formattedTime = time.toFormat('MMMM dd, yyyy hh:mm a');

    return res.json({
      timezone,
      localTime: formattedTime,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch time data' });
  }
};

module.exports = { getTimeByTimezone };
