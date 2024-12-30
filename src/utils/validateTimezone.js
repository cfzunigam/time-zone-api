const { DateTime } = require('luxon');
const { methodsError } = require('../utils/methods');

const validateTimeParam = (req, res, next) => {
  let { timezone, 'utc-offset': utcOffset, 'gmt-offset': gmtOffset } = req.query;

  try {
    if (timezone) {
      if (!DateTime.now().setZone(timezone).isValid) {
        return res.status(400).json({
          error: methodsError['timezone']?.error || 'Invalid time parameter',
          validFormat: methodsError['timezone']?.validFormat || 'Invalid format',
        });
      }
      return next();
    }

    if (utcOffset) {
      const cleanedOffset = utcOffset
      .replace(/^UTC/, '')
      .replace(' ', '+');
      
      const utcPattern = /^[+-]\d{2}:\d{2}$/;
    
      if (!utcPattern.test(cleanedOffset)) {
        return res.status(400).json({
          error: methodsError['utcOffset']?.error || 'Invalid time parameter',
          validFormat: methodsError['utcOffset']?.validFormat || 'Invalid format',
        });
      }
      return next();
    }
    

    if (gmtOffset) {
      const cleanedGmtOffset = gmtOffset.replace(' ', '+');
      const gmtPattern = /^GMT([+-])(\d{2}):(\d{2})$/;
    
      if (!gmtPattern.test(cleanedGmtOffset)) {
        return res.status(400).json({
          error: methodsError['gmtOffset']?.error || 'Invalid time parameter',
          validFormat: methodsError['gmtOffset']?.validFormat || 'Invalid format',
        });
      }
    
      return next();
    }
    
    return res.status(400).json({
      error: 'At least one of timezone, utc-offset, or gmt-offset query parameters is required.',
    });
  } catch (error) {
    console.error('Error in validateTimeParam:', error);
    return res.status(500).json({ error: 'Failed to validate time parameter' });
  }
};

module.exports = {
  validateTimeParam,
};
