const { DateTime } = require('luxon');
const { getTime } = require('./timeController'); // Ajusta la ruta de tu archivo
const { methodsError } = require('../utils/methods');

// Mock de la función `DateTime.now()` de Luxon
jest.mock('luxon', () => {
  const actualLuxon = jest.requireActual('luxon');
  return {
    ...actualLuxon,
    DateTime: {
      now: jest.fn().mockReturnValue({
        setZone: jest.fn().mockReturnThis(),
        toFormat: jest.fn(),
        isValid: true,
      }),
    },
  };
});

describe('getTime', () => {
  let req, res;
  
  beforeEach(() => {
    req = { query: {} };
    res = { 
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return the correct formatted time for timezone', async () => {
    const timezone = 'America/New_York';
    const formattedTime = 'December 29, 2024 03:00 PM';  // El formato depende de tu localización
    DateTime.now().setZone().toFormat.mockReturnValue(formattedTime);

    req.query.timezone = timezone;

    await getTime(req, res);

    expect(DateTime.now().setZone).toHaveBeenCalledWith(timezone);
    expect(res.json).toHaveBeenCalledWith({
      type: 'timezone',
      timezone,
      localTime: formattedTime,
    });
  });

  it('should return the correct formatted time for UTC offset', async () => {
    const utcOffset = 'UTC+02:00';
    const cleanedOffset = '+02:00';
    const formattedTime = 'December 29, 2024 03:00 PM';
    DateTime.now().setZone.mockReturnValue({
      toFormat: jest.fn().mockReturnValue(formattedTime),
    });

    req.query['utc-offset'] = utcOffset;

    await getTime(req, res);

    expect(DateTime.now().setZone).toHaveBeenCalledWith('UTC' + cleanedOffset);
    expect(res.json).toHaveBeenCalledWith({
      type: 'utc-offset',
      utcOffset,
      localTime: formattedTime,
    });
  });

  it('should return the correct formatted time for GMT offset', async () => {
    const gmtOffset = 'GMT+02:00';
    const cleanedOffset = '+02:00';
    const formattedTime = 'December 29, 2024 03:00 PM';
    DateTime.now().setZone.mockReturnValue({
      toFormat: jest.fn().mockReturnValue(formattedTime),
    });

    req.query['gmt-offset'] = gmtOffset;

    await getTime(req, res);

    expect(DateTime.now().setZone).toHaveBeenCalledWith('UTC' + cleanedOffset);
    expect(res.json).toHaveBeenCalledWith({
      type: 'gmt-offset',
      gmtOffset: cleanedOffset,
      localTime: formattedTime,
    });
  });

  it('should return an error if no query parameter is provided', async () => {
    await getTime(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'At least one of timezone, utc-offset, or gmt-offset query parameters is required.',
    });
  });

  // it('should handle errors correctly in getTime (catch block)', async () => {
  //   const errorMessage = 'Failed to fetch time data';

  //   // Simula que getTime lanza un error
  //   getTime.mockImplementationOnce(() => {
  //     throw new Error(errorMessage);
  //   });

  //   // Realizamos la llamada a la función con parámetros simulados
  //   await getTime(req, res);

  //   // Verifica que el error fue manejado correctamente
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  // });
});
