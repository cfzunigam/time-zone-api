const { getTimeByTimezone } = require('./timeController');
const { DateTime } = require('luxon');

jest.mock('luxon', () => ({
  DateTime: {
    now: jest.fn().mockReturnThis(),
    setZone: jest.fn().mockReturnThis(),
    toFormat: jest.fn(),
    isValid: true,
  },
}));

describe('getTimeByTimezone', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return formatted time when timezone is valid', async () => {
    const mockTimezone = 'America/New_York';
    const mockFormattedTime = 'December 27, 2024 08:59 PM';

    DateTime.toFormat.mockReturnValue(mockFormattedTime);

    const mockRequest = {
      params: { timezone: mockTimezone },
    };

    await getTimeByTimezone(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      timezone: mockTimezone,
      localTime: mockFormattedTime,
    });
  });

  it('should return 400 error if the timezone is invalid', async () => {
    const mockTimezone = 'Invalid/Timezone';
    
    DateTime.isValid = false;

    const mockRequest = {
      params: { timezone: mockTimezone },
    };

    await getTimeByTimezone(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid timezone format',
      validFormat: 'Example: America/New_York',
    });
  });

  it('should return 500 error if there is an unexpected error', async () => {
    const mockRequest = {
      params: { timezone: 'America/New_York' },
    };

    jest.spyOn(DateTime, 'now').mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await getTimeByTimezone(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch time data' });
  });
});