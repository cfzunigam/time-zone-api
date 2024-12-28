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

const validateUtcOffset = (req, res, next) => {
  const { utcOffset } = req.params;

  // Elimina el prefijo "UTC" si existe
  const cleanedOffset = utcOffset.replace(/^UTC/, '');


  // Verifica si el formato es válido usando una expresión regular
  const utcPattern = /^[+-]\d{2}:\d{2}$/;

  if (!utcPattern.test(cleanedOffset)) {
    return res.status(400).json({
      error: 'Invalid UTC offset format',
      validFormat: 'Example: UTC+02:00 or UTC-05:00',
    });
  }

  try {
    // Intenta crear un DateTime con el UTC offset
    const time = DateTime.now().setZone('UTC' + cleanedOffset);

    if (!time.isValid) {
      return res.status(400).json({
        error: 'Invalid UTC offset value',
        validFormat: 'Example: UTC+02:00 or UTC-05:00',
      });
    }

    // Si todo es válido, pasa al siguiente middleware
    next();
  } catch (error) {
    console.error('Error in validateUtcOffset:', error);
    return res.status(500).json({ error: 'Failed to validate UTC offset' });
  }
};

const validateGmtOffset = (req, res, next) => {
  const { gmtOffset } = req.params;

  // Verifica si el formato es algo como "GMT+02:00" o "GMT-05:00"
  const gmtPattern = /^GMT([+-])(\d{2}):(\d{2})$/;

  if (!gmtPattern.test(gmtOffset)) {
    return res.status(400).json({
      error: 'Invalid GMT offset format',
      validFormat: 'Example: GMT+02:00 or GMT-05:00'
    });
  }

  next();
};

module.exports = {
  validateTimezone,
  validateUtcOffset,
  validateGmtOffset,
};
