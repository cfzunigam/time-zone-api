const methodsError = {
  timezone: {
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

module.exports = { 
    methodsError,
};