const { DateTime } = require('luxon');
const { validateTimeParam } = require('./validateTimezone'); 

jest.mock('luxon', () => {
  const actualLuxon = jest.requireActual('luxon');
  return {
    ...actualLuxon,
    DateTime: {
      now: jest.fn().mockReturnValue({
        setZone: jest.fn().mockReturnThis(),
        isValid: true,
      }),
    },
  };
});

describe('validateTimeParam', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return an error for invalid timezone', async () => {
    const invalidTimezone = 'Invalid/Timezone';
    DateTime.now().setZone.mockReturnValue({
      isValid: false,
    });

    req.query.timezone = invalidTimezone;

    await validateTimeParam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid timezone format',
    validFormat: 'Example: America/New_York',
    });
  });

  it('should call next for valid timezone', async () => {
    const validTimezone = 'America/New_York';
    DateTime.now().setZone.mockReturnValue({
      isValid: true,
    });

    req.query.timezone = validTimezone;

    await validateTimeParam(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return an error for invalid UTC offset format', async () => {
    const invalidUtcOffset = 'UTC+2:60';  // Invalid offset
    req.query['utc-offset'] = invalidUtcOffset;

    await validateTimeParam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid UTC offset format',
      validFormat: 'Example: UTC+02:00 or UTC-05:00',
    });
  });

  it('should call next for valid UTC offset', async () => {
    const validUtcOffset = 'UTC+02:00';
    req.query['utc-offset'] = validUtcOffset;

    await validateTimeParam(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return an error for invalid GMT offset format', async () => {
    const invalidGmtOffset = 'GM%02:60';  // Invalid GMT offset
    req.query['gmt-offset'] = invalidGmtOffset;

    await validateTimeParam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid GMT offset format',
      validFormat: 'Example: GMT+02:00 or GMT-05:00',
    });
  });

  it('should call next for valid GMT offset', async () => {
    const validGmtOffset = 'GMT+02:00';
    req.query['gmt-offset'] = validGmtOffset;

    await validateTimeParam(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return an error if no valid parameter is provided', async () => {
    await validateTimeParam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'At least one of timezone, utc-offset, or gmt-offset query parameters is required.',
    });
  });

  // it('should handle errors correctly', async () => {
  //   const errorMessage = 'Failed to validate time parameter';
  //   const error = new Error(errorMessage);
  //   validateTimeParam.mockImplementationOnce(() => { throw error; });

  //   await validateTimeParam(req, res, next);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  // });
});
