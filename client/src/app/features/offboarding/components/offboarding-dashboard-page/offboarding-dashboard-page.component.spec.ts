import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingDashboardPageComponent } from './offboarding-dashboard-page.component';
import { EmployeesStore } from '../../stores/employees.store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Employee } from '../../domain/employee.types';
import { signal, WritableSignal } from '@angular/core';
import { generateEmployee } from '../../../../../tests/test-object-generators';
import { By } from '@angular/platform-browser';
import { OffboardingEmployeeListComponent } from '../offboarding-employee-list/offboarding-employee-list.component';
import { provideRouter } from '@angular/router';

describe('OffboardingDashboardPageComponent', () => {
  let component: OffboardingDashboardPageComponent;
  let fixture: ComponentFixture<OffboardingDashboardPageComponent>;
  let loader: HarnessLoader;
  let employees: WritableSignal<Employee[]>;
  let isLoading: WritableSignal<boolean>;
  let isError: WritableSignal<boolean>;
  let error: WritableSignal<string>;
  let mockEmployeesStore: jest.Mocked<EmployeesStore>;

  beforeEach(async () => {
    employees = signal([]);
    isLoading = signal(false);
    isError = signal(false);
    error = signal('');

    mockEmployeesStore = {
      employees,
      isLoading,
      isError,
      error,
      loadEmployees: jest.fn(),
    } as unknown as jest.Mocked<EmployeesStore>;

    await TestBed.configureTestingModule({
      imports: [OffboardingDashboardPageComponent, NoopAnimationsModule],
      providers: [
        {
          provide: EmployeesStore,
          useValue: mockEmployeesStore,
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingDashboardPageComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    employees.set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadEmployee on init', () => {
    expect(mockEmployeesStore.loadEmployees).toHaveBeenCalled();
  });

  it('should display loading state', () => {
    isLoading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Error: Error');
    expect(employeeList()).toBeNull();
  });

  it('should display error state', () => {
    isError.set(true);
    error.set('Error');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Error: Error');
    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(employeeList()).toBeNull();
  });

  it('should display employees', () => {
    employees.set([generateEmployee({ id: 'employee-1' })]);
    fixture.detectChanges();

    expect(employeeList().componentInstance.employees()).toEqual([
      generateEmployee({ id: 'employee-1' }),
    ]);
    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Error: Error');
  });

  describe('filtering', () => {
    it('should filter employees by name', async () => {
      employees.set([
        generateEmployee({
          id: 'employee-1',
          name: 'John Doe',
        }),
        generateEmployee({
          id: 'employee-2',
          name: 'Jane Doe',
        }),
      ]);

      fixture.detectChanges();

      const filter = await loader.getHarness(MatInputHarness);
      await filter.setValue('john');

      await fixture.whenStable();
      fixture.detectChanges();

      expect(employeeList().componentInstance.employees()).toEqual([
        generateEmployee({
          id: 'employee-1',
          name: 'John Doe',
        }),
      ]);
    });

    it('should filter employees by department', async () => {
      employees.set([
        generateEmployee({ department: 'Engineering' }),
        generateEmployee({ department: 'Marketing' }),
      ]);

      fixture.detectChanges();

      const filter = await loader.getHarness(MatInputHarness);
      await filter.setValue('marketing');

      await fixture.whenStable();
      fixture.detectChanges();

      expect(employeeList().componentInstance.employees()).toEqual([
        generateEmployee({ department: 'Marketing' }),
      ]);
    });
  });

  const employeeList = () =>
    fixture.debugElement.query(By.directive(OffboardingEmployeeListComponent));
});
