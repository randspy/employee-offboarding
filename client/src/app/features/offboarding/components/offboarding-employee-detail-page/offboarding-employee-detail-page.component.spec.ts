import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OffboardingEmployeeDetailPageComponent } from './offboarding-employee-detail-page.component';
import { EmployeesStore } from '../../stores/employees.store';
import { signal, WritableSignal } from '@angular/core';
import { Employee } from '../../domain/employee.types';
import { generateEmployee } from '../../../../../tests/test-object-generators';
import { By } from '@angular/platform-browser';
import { OffboardingDialogComponent } from '../offboarding-dialog/offboarding-dialog.component';

describe('OffboardingEmployeeDetailPageComponent', () => {
  let component: OffboardingEmployeeDetailPageComponent;
  let fixture: ComponentFixture<OffboardingEmployeeDetailPageComponent>;
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
      loadEmployee: jest.fn(),
    } as unknown as jest.Mocked<EmployeesStore>;

    await TestBed.configureTestingModule({
      imports: [OffboardingEmployeeDetailPageComponent],
      providers: [
        { provide: EmployeesStore, useValue: mockEmployeesStore },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingEmployeeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'employee-1');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    employees.set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadEmployee on init', () => {
    expect(
      (
        mockEmployeesStore.loadEmployee as unknown as jest.Mock
      ).mock.calls[0][0](),
    ).toBe('employee-1');
  });

  it('should display loading state', () => {
    isLoading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('Error: Error');
    expect(fixture.nativeElement.textContent).not.toContain('John Doe');
  });

  it('should display error state', () => {
    isError.set(true);
    error.set('Error');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Error: Error');
    expect(fixture.nativeElement.textContent).not.toContain('Loading...');
    expect(fixture.nativeElement.textContent).not.toContain('John Doe');
  });

  it('should load employee', () => {
    employees.set([
      generateEmployee({
        id: 'employee-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Department 1',
        equipments: [
          {
            id: 'equipment-1',
            name: 'Equipment 1',
          },
          {
            id: 'equipment-2',
            name: 'Equipment 2',
          },
        ],
      }),
    ]);

    fixture.detectChanges();

    const page = fixture.nativeElement;
    expect(page.textContent).toContain('John Doe');
    expect(page.textContent).toContain('john.doe@example.com');
    expect(page.textContent).toContain('Department 1');
    expect(page.textContent).toContain('Equipment 1');
    expect(page.textContent).toContain('Equipment 2');
    expect(page.textContent).not.toContain('Loading...');
    expect(page.textContent).not.toContain('Error: Error');
  });

  it('should have a back button', () => {
    const backLink = fixture.debugElement.query(By.css('a'));

    expect(backLink.nativeElement.textContent).toContain('Back');
    expect(
      backLink.nativeElement.attributes.getNamedItem('ng-reflect-router-link')
        .value,
    ).toContain('../');
  });

  describe('offboard button', () => {
    it('should be enabled if employee is not offboarded', async () => {
      employees.set([generateEmployee({ id: 'employee-1', status: 'ACTIVE' })]);

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(false);
    });

    it('should disable offboard button if employee is offboarded', async () => {
      employees.set([
        generateEmployee({ id: 'employee-1', status: 'OFFBOARDED' }),
      ]);

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBe(true);
    });

    it('should open the offboard dialog', () => {
      // there is css compilation for the dialog, we don't care about it
      jest.spyOn(console, 'error').mockImplementation();
      const spy = jest.spyOn(component.dialog, 'open');
      employees.set([generateEmployee({ id: 'employee-1', status: 'ACTIVE' })]);

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      button.nativeElement.click();

      expect(spy).toHaveBeenCalledWith(OffboardingDialogComponent, {
        width: '800px',
        disableClose: true,
        data: {
          id: 'employee-1',
        },
      });
    });
  });
});
