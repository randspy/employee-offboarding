import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UsersStore } from './users.store';
import { UserService } from '../services/user.service';
import { LoggerService } from '../../../core/errors/services/logger.service';
import { mockLoggerService } from '../../../../tests/mock-logger-service';
import { of, throwError } from 'rxjs';
import { OffboardResponse } from '../domain/offboard.types';
import { delay } from 'rxjs';
import { generateOffboarding } from '../../../../tests/test-object-generators';

describe('UsersStore', () => {
  let service: UsersStore;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      offboardEmployee: jest.fn(),
    } as Partial<jest.Mocked<UserService>> as jest.Mocked<UserService>;

    TestBed.configureTestingModule({
      providers: [
        UsersStore,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    });
    service = TestBed.inject(UsersStore);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('offboardEmployee', () => {
    it('should offboard an employee', fakeAsync(() => {
      mockOffboardEmployee({
        id: 'test-id',
        message: 'test-message',
      });

      service.offboardEmployee({
        id: 'test-id',
        offboarding: generateOffboarding({ email: 'test-email' }),
      });
      tick(1);

      expect(service.isLoading()).toBe(false);
      expect(service.isError()).toBe(false);
      expect(service.error()).toBe('');
    }));

    it('should handle error', fakeAsync(() => {
      const error = new Error('Error');
      userService.offboardEmployee.mockReturnValue(throwError(() => error));

      service.offboardEmployee({
        id: 'test-id',
        offboarding: generateOffboarding({ email: 'test-email' }),
      });
      tick(1);

      expect(service.isError()).toBe(true);
      expect(service.error()).toBe('Failed to offboard employee');
      expect(mockLoggerService.error).toHaveBeenCalledWith(error);
    }));

    it('should handle loading state', fakeAsync(() => {
      mockOffboardEmployee({
        id: 'test-id',
        message: 'test-message',
      });

      service.offboardEmployee({
        id: 'test-id',
        offboarding: generateOffboarding({ email: 'test-email' }),
      });

      expect(service.isLoading()).toBe(true);
    }));
  });

  const mockOffboardEmployee = (offboardResponse: OffboardResponse) => {
    userService.offboardEmployee.mockReturnValue(
      of(offboardResponse).pipe(delay(1)),
    );
  };
});
