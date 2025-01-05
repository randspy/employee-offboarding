import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingDashboardPageComponent } from './offboarding-dashboard-page.component';

describe('OffboardingDashboardPageComponent', () => {
  let component: OffboardingDashboardPageComponent;
  let fixture: ComponentFixture<OffboardingDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingDashboardPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
