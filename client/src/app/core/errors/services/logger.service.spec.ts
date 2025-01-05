import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import {
  ITransporter,
  CapturedPayload,
  LogLevel,
  LOGGER_TRANSPORTER,
} from '../domain/logger.types';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoggerService', () => {
  let service: LoggerService;
  let transporterMock: jest.Mocked<ITransporter<CapturedPayload>>;
  let mockDate: Date;

  beforeEach(() => {
    transporterMock = {
      log: jest.fn(),
    } as jest.Mocked<ITransporter<CapturedPayload>>;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LOGGER_TRANSPORTER,
          useValue: transporterMock,
        },
      ],
    });

    service = TestBed.inject(LoggerService);
  });

  beforeEach(() => {
    mockDate = new Date('2024-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const testCases: { method: keyof LoggerService; level: LogLevel }[] = [
    { method: 'info', level: 'INFO' },
    { method: 'debug', level: 'DEBUG' },
    { method: 'warn', level: 'WARN' },
    { method: 'error', level: 'ERROR' },
  ];

  testCases.forEach(({ method, level }) => {
    describe(`${method} method`, () => {
      it(`should log string messages with ${level} level`, () => {
        const message = 'test message';

        service[method](message);

        expect(transporterMock.log).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: message,
            level: level,
            timestamp: mockDate,
          }),
          level,
        );
      });

      it(`should log Error objects with ${level} level`, () => {
        const error = new Error('test error');
        service[method](error);

        expect(transporterMock.log).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: error,
            level: level,
            timestamp: mockDate,
          }),
          level,
        );
      });

      it(`should log HttpErrorResponse with ${level} level`, () => {
        const httpError = new HttpErrorResponse({ error: 'test error' });
        service[method](httpError);

        expect(transporterMock.log).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: httpError,
            level: level,
            timestamp: mockDate,
          }),
          level,
        );
      });
    });
  });
});
