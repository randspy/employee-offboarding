import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EmployeesStore } from './employees.store';
import { EmployeeService } from '../services/employee.service';
import { generateEmployee } from '../../../../tests/test-object-generators';
import { delay, of } from 'rxjs';
import { Employee } from '../domain/employee.types';

describe('EmployeesStore', () => {
  let store: EmployeesStore;
  let employeeService: jest.Mocked<EmployeeService>;

  beforeEach(() => {
    employeeService = {
      getEmployees: jest.fn(),
      getEmployee: jest.fn(),
    } as Partial<jest.Mocked<EmployeeService>> as jest.Mocked<EmployeeService>;

    TestBed.configureTestingModule({
      providers: [
        EmployeesStore,
        { provide: EmployeeService, useValue: employeeService },
      ],
    });

    store = TestBed.inject(EmployeesStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('loadEmployees', () => {
    it('should load employees', fakeAsync(() => {
      const employees = [
        generateEmployee({ id: 'employee-1' }),
        generateEmployee({ id: 'employee-2' }),
      ];

      mockGetEmployees(employees);

      store.loadEmployees();

      tick(1);
      expect(store.employees()).toEqual(employees);
    }));

    it('should handle loading state correctly', fakeAsync(() => {
      const employees = [
        generateEmployee({ id: 'employee-1' }),
        generateEmployee({ id: 'employee-2' }),
      ];

      mockGetEmployees(employees);

      expect(store.isLoading()).toBe(false);

      store.loadEmployees();
      expect(store.isLoading()).toBe(true);

      tick(1);

      expect(store.isLoading()).toBe(false);
    }));

    it('should not load employees if they are already loaded', fakeAsync(() => {
      const employees = [
        generateEmployee({ id: 'employee-1' }),
        generateEmployee({ id: 'employee-2' }),
      ];

      mockGetEmployees(employees);

      store.loadEmployees();
      tick(1);

      const employeesSecondCall = [
        generateEmployee({ id: 'employee-3' }),
        generateEmployee({ id: 'employee-4' }),
      ];

      mockGetEmployees(employeesSecondCall);

      store.loadEmployees();
      tick(1);

      expect(store.employees()).toEqual(employees);
    }));

    it('should merge employees with with already loaded employee', fakeAsync(() => {
      mockGetEmployee(
        generateEmployee({ id: 'employee-1', status: 'OFFBOARDED' }),
      );

      store.loadEmployee('employee-1');
      tick(1);

      const employees = [
        generateEmployee({ id: 'employee-1' }),
        generateEmployee({ id: 'employee-2' }),
      ];

      mockGetEmployees(employees);

      store.loadEmployees();
      tick(1);

      expect(store.employees()).toEqual([
        generateEmployee({ id: 'employee-1', status: 'OFFBOARDED' }),
        generateEmployee({ id: 'employee-2' }),
      ]);
    }));
  });

  describe('loadEmployee', () => {
    it('should load employee', fakeAsync(() => {
      const employee = generateEmployee({ id: 'employee-1' });
      mockGetEmployee(employee);

      store.loadEmployee('employee-1');
      tick(1);

      expect(store.employees()).toEqual([employee]);
    }));

    it('should handle loading state correctly', fakeAsync(() => {
      const employee = generateEmployee({ id: 'employee-1' });
      mockGetEmployee(employee);

      expect(store.isLoading()).toBe(false);

      store.loadEmployee('employee-1');
      expect(store.isLoading()).toBe(true);

      tick(1);
      expect(store.isLoading()).toBe(false);
    }));

    it('should not load employee if it is already loaded', fakeAsync(() => {
      mockGetEmployees([generateEmployee({ id: 'employee-1' })]);

      store.loadEmployees();
      tick(1);

      mockGetEmployee(generateEmployee({ id: 'employee-2' }));

      store.loadEmployee('employee-1');
      tick(1);

      expect(store.employees()).toEqual([
        generateEmployee({ id: 'employee-1' }),
      ]);
    }));
  });

  const mockGetEmployees = (employees: Employee[]) => {
    employeeService.getEmployees.mockReturnValue(of(employees).pipe(delay(1)));
  };

  const mockGetEmployee = (employee: Employee) => {
    employeeService.getEmployee.mockReturnValue(of(employee).pipe(delay(1)));
  };
});
