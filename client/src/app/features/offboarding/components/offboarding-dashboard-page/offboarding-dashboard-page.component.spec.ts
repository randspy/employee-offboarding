import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingDashboardPageComponent } from './offboarding-dashboard-page.component';
import { EmployeesStore } from '../../stores/employees.store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockEmployeeStore } from '../../../../../tests/mock-employee-store';

describe('OffboardingDashboardPageComponent', () => {
  let component: OffboardingDashboardPageComponent;
  let fixture: ComponentFixture<OffboardingDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingDashboardPageComponent, NoopAnimationsModule],
      providers: [
        {
          provide: EmployeesStore,
          useValue: mockEmployeeStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
