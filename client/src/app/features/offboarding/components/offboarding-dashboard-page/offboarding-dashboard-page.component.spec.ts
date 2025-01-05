import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingDashboardPageComponent } from './offboarding-dashboard-page.component';
import { signal } from '@angular/core';
import { EmployeesStore } from '../../stores/employees.store';

describe('OffboardingDashboardPageComponent', () => {
  let component: OffboardingDashboardPageComponent;
  let fixture: ComponentFixture<OffboardingDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingDashboardPageComponent],
      providers: [
        {
          provide: EmployeesStore,
          useValue: {
            employees: signal([]),
            loadEmployees: jest.fn(),
          },
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
