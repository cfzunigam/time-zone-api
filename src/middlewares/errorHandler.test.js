const errorHandler = require('./errorHandler');

describe('errorHandler', () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      statusCode: null,
      json: jest.fn((data) => {
        this.data = data;
      }),
      status: jest.fn(function (statusCode) {
        this.statusCode = statusCode;
        return this; // Para encadenar .json()
      }),
    };
    mockNext = jest.fn();
  });

  it('should return 500 error with the correct message when an error is thrown', () => {
    const error = new Error('Something went wrong');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.statusCode).toBe(500);

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  });

  it('should log the error stack', () => {
    const error = new Error('Test error');
    console.error = jest.fn();

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(console.error).toHaveBeenCalledWith(error.stack);
  });
});
