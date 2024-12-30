const { DateTime } = require('luxon');

function timeValidator(timeParam) {
  const time = DateTime.now().setZone(timeParam);
  const formattedTime = time.toFormat('MMMM dd, yyyy hh:mm a');
  return { formattedTime };
}

const getTime = (req, res) => {
  const { timezone, 'utc-offset': utcOffset, 'gmt-offset': gmtOffset } = req.query;

  try {
    if (timezone) {
      const result = timeValidator(timezone);

      return res.json({
        type: 'timezone',
        timezone,
        localTime: result.formattedTime,
      });
    }
    if (utcOffset) {
      const cleanedOffset = utcOffset
      .replace(/^UTC/, '')
      .replace(' ', '+');
      
      const result = timeValidator('UTC' + cleanedOffset);

      return res.json({
        type: 'utc-offset',
        utcOffset,
        localTime: result.formattedTime,
      });
    }
    if (gmtOffset) {
      const cleanedOffset = gmtOffset
      .replace(/^GMT/, '')
      .replace(' ', '+');

      const result = timeValidator(`UTC${cleanedOffset}`);

      return res.json({
        type: 'gmt-offset',
        gmtOffset: cleanedOffset,
        localTime: result.formattedTime,
      });
    }

    return res.status(400).json({
      error: 'At least one of timezone, utc-offset, or gmt-offset query parameters is required.',
    });
  } catch (error) {
    console.error('Error in getTime:', error);
    return res.status(500).json({ error: 'Failed to fetch time data' });
  }
};

module.exports = { 
  getTime
};
