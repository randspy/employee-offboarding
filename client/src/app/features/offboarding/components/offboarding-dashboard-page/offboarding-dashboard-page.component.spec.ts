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
import { LoaderComponent } from '../../../../ui/components/loader/loader.component';

describe('OffboardingDashboardPageComponent', () => {
  let component: OffboardingDashboardPageComponent;
  let fixture: ComponentFixture<OffboardingDashboardPageComponent>;
  let loader: HarnessLoader;
  let employees: WritableSignal<Employee[]>;
  let isLoading: WritableSignal<boolean>;
  let mockEmployeesStore: jest.Mocked<EmployeesStore>;

  beforeEach(async () => {
    employees = signal([]);
    isLoading = signal(false);

    mockEmployeesStore = {
      employees,
      isLoading,
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

    expect(loaderComponent()).toBeTruthy();
    expect(employeeList()).toBeNull();
  });

  it('should display no employees found message', () => {
    employees.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No employees found');
    expect(loaderComponent()).toBeNull();
  });

  it('should display employees', () => {
    employees.set([generateEmployee({ id: 'employee-1' })]);
    fixture.detectChanges();

    expect(employeeList().componentInstance.employees()).toEqual([
      generateEmployee({ id: 'employee-1' }),
    ]);
    expect(loaderComponent()).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain(
      'No employees found',
    );
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

  const loaderComponent = () =>
    fixture.debugElement.query(By.directive(LoaderComponent));
});
