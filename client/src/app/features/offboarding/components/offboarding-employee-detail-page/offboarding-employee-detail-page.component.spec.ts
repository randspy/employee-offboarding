import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingEmployeeDetailPageComponent } from './offboarding-employee-detail-page.component';

describe('OffboardingEmployeeDetailPageComponent', () => {
  let component: OffboardingEmployeeDetailPageComponent;
  let fixture: ComponentFixture<OffboardingEmployeeDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingEmployeeDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingEmployeeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
