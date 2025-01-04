import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingPageComponent } from './offboarding-page.component';

describe('OffboardingPageComponent', () => {
  let component: OffboardingPageComponent;
  let fixture: ComponentFixture<OffboardingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
