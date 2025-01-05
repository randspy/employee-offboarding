import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Employee } from '../domain/employee.types';
import { generateEmployee } from '../../../../tests/test-object-generators';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmployees', () => {
    it('should return all employees', (done) => {
      const mockEmployees: Employee[] = [
        generateEmployee({ id: 'employee-1' }),
        generateEmployee({ id: 'employee-2' }),
      ];

      service.getEmployees().subscribe((employees) => {
        expect(employees).toEqual(mockEmployees);
        done();
      });

      const req = httpMock.expectOne('/api/employees');
      expect(req.request.method).toBe('GET');
      req.flush(mockEmployees);
    });
  });

  describe('getEmployee', () => {
    it('should return a single employee by id', (done) => {
      const mockEmployee: Employee = generateEmployee({ id: 'employee-1' });

      service.getEmployee('employee-1').subscribe((employee) => {
        expect(employee).toEqual(mockEmployee);
        done();
      });

      const req = httpMock.expectOne('/api/employees/employee-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockEmployee);
    });
  });
});
