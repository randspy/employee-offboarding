import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Offboarding } from '../domain/offboard.types';
import { generateOffboarding } from '../../../../tests/test-object-generators';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('offboardEmployee', () => {
    it('should offboard an employee', (done) => {
      const mockOffboarding: Offboarding = generateOffboarding({
        email: 'test-email',
      });

      service.offboardEmployee('test-id', mockOffboarding).subscribe((res) => {
        expect(res).toEqual({
          message: 'Offboarding data saved successfully',
          id: 'test-id',
        });
        done();
      });

      const req = httpMock.expectOne('/api/users/test-id/offboard');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOffboarding);

      req.flush({
        message: 'Offboarding data saved successfully',
        id: 'test-id',
      });
    });
  });
});
