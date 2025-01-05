import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error.handler';
import { LoggerService } from '../services/logger.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';

describe('GlobalErrorHandler', () => {
  let errorHandler: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    });

    errorHandler = TestBed.inject(GlobalErrorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log an Error instance', () => {
    const error = new Error('Test error');

    errorHandler.handleError(error);

    expect(mockLoggerService.error).toHaveBeenCalledWith(error);
  });

  it('should log a string error', () => {
    const error = 'A string error';

    errorHandler.handleError(error);

    expect(mockLoggerService.error).toHaveBeenCalledWith('A string error');
  });

  it('should log a null error', () => {
    const error = null;

    errorHandler.handleError(error);

    expect(mockLoggerService.error).toHaveBeenCalledWith('Null error');
  });

  it('should log an undefined error', () => {
    const error = undefined;

    errorHandler.handleError(error);

    expect(mockLoggerService.error).toHaveBeenCalledWith('Undefined error');
  });

  it('should log an object error', () => {
    const error = { message: 'An object error', code: 500 };

    errorHandler.handleError(error);

    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'message: An object error, code: 500',
    );
  });

  it('should log an error that cannot be stringified', () => {
    const nonStringifiableFunction = function () {
      throw new Error('Cannot stringify');
    };

    // Override the toString method to throw an error
    nonStringifiableFunction.toString = function () {
      throw new Error('Cannot stringify');
    };

    errorHandler.handleError(nonStringifiableFunction);

    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'Error could not be stringified',
    );
  });
});
