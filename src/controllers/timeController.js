const { DateTime } = require('luxon');

const methodsError = {
  timeone: {
    error: 'Invalid timezone format',
    validFormat: 'Example: America/New_York',
  },
  utcOffset: {
    error: 'Invalid UTC offset format',
    validFormat: 'Example: UTC+02:00 or UTC-05:00',
  }, 
  gmtOffset: {
    error: 'Invalid GMT offset format',
    validFormat: 'Example: GMT+02:00 or GMT-05:00',
  }
}

function timeValidator(timeParam, method) {
  const time = DateTime.now().setZone(timeParam);

  if (!time.isValid) {
    return {
      error: methodsError[method].error,
      validFormat: methodsError[method].validFormat,
    };
  }
  
  const formattedTime = time.toFormat('MMMM dd, yyyy hh:mm a');
  return { formattedTime };
}

const getTimeByTimezone = (req, res) => {
  const { timezone } = req.params;

  try {
    const result = timeValidator(timezone, 'timezone');

    if (result.error) {
      return res.status(400).json({
        error: result.error,
        validFormat: result.validFormat,
      });
    }

    return res.json({
      timezone,
      localTime: result.formattedTime,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch time data' });
  }
};

const getTimeByUtcOffset = (req, res) => {
  const { utcOffset } = req.params;

  try {
    const result = timeValidator(utcOffset, 'utcOffset');

    if (result.error) {
      return res.status(400).json({
        error: result.error,
        validFormat: result.validFormat,
      });
    }
    return res.json({
      utcOffset,
      localTime: result.formattedTime,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch time data' });
  }
};


const getTimeByGmtOffset = (req, res) => {
  const { gmtOffset } = req.params;

  const cleanedOffset = gmtOffset.replace(/^GMT/, '');

  const gmtPattern = /^[+-]\d{2}:\d{2}$/;

  if (!gmtPattern.test(cleanedOffset)) {
    return res.status(400).json({
      error: 'Invalid GMT offset format',
      validFormat: 'Example: GMT+02:00 or GMT-05:00',
    });
  }

  try {
    const result = timeValidator('UTC' + cleanedOffset, 'gmtOffset');

    if (result.error) {
      return res.status(400).json({
        error: result.error,
        validFormat: result.validFormat,
      });
    }

    return res.json({
      gmtOffset: cleanedOffset,
      localTime: result.formattedTime,
    });
  } catch (error) {
    console.error('Error in Luxon:', error);
    return res.status(500).json({ error: 'Failed to fetch time data' });
  }
};

module.exports = { 
  getTimeByTimezone,
  getTimeByUtcOffset,
  getTimeByGmtOffset,
};
