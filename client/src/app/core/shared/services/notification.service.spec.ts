import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { ToastrService } from 'ngx-toastr';
import { LoggerService } from '../../errors/services/logger.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastrService: ToastrService;
  beforeEach(() => {
    toastrService = {
      error: jest.fn(),
    } as Partial<ToastrService> as ToastrService;

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastrService, useValue: toastrService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show error', () => {
    const error = new Error('Error');

    service.showError(error, 'Failed to load employee');

    expect(toastrService.error).toHaveBeenCalledWith(
      'Failed to load employee',
      'Error',
    );
  });

  it('should show error with message from the error', () => {
    const error = new Error('Error message');

    service.showError(error);

    expect(toastrService.error).toHaveBeenCalledWith('Error message', 'Error');
  });

  it('should log error', () => {
    const error = new Error('Error message');

    service.showError(error);

    expect(mockLoggerService.error).toHaveBeenCalledWith('Error message');
  });
});
