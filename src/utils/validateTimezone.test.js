const { DateTime } = require('luxon');
const validateTimezone = require('./validateTimezone'); // Ajusta la ruta

describe('validateTimezone', () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    // Creamos los mocks de Express
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() if the timezone is valid', () => {
    // Configuramos el mock de DateTime para simular una zona horaria válida
    const mockTimezone = 'America/New_York';
    jest.spyOn(DateTime, 'now').mockReturnValue({
      setZone: jest.fn().mockReturnValue({
        isValid: true,
      }),
    });

    mockRequest.params = { timezone: mockTimezone };

    // Llamamos a la función
    validateTimezone(mockRequest, mockResponse, mockNext);

    // Verificamos que next() haya sido llamado
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should return 400 with an error message if the timezone is invalid', () => {
    // Configuramos el mock de DateTime para simular una zona horaria inválida
    const mockTimezone = 'Invalid/Timezone';
    jest.spyOn(DateTime, 'now').mockReturnValue({
      setZone: jest.fn().mockReturnValue({
        isValid: false,
      }),
    });

    mockRequest.params = { timezone: mockTimezone };

    // Llamamos a la función
    validateTimezone(mockRequest, mockResponse, mockNext);

    // Verificamos que res.status(400) haya sido llamado
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // Verificamos que res.json haya sido llamado con el mensaje de error correcto
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid timezone format',
      validFormat: 'Example: America/New_York',
    });

    // Verificamos que next no haya sido llamado
    expect(mockNext).not.toHaveBeenCalled();
  });
});
