import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardEmployeePageComponent } from './offboard-employee-page.component';

describe('OffboardEmployeePageComponent', () => {
  let component: OffboardEmployeePageComponent;
  let fixture: ComponentFixture<OffboardEmployeePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardEmployeePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffboardEmployeePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
