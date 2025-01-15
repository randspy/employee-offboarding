import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';
import { By } from '@angular/platform-browser';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a small loader', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    const loader = fixture.debugElement.query(By.css('.w-5'));

    expect(loader.nativeElement.classList).toContain('w-5');
  });

  it('should show a large loader', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const loader = fixture.debugElement.query(By.css('.w-16'));
    expect(loader.nativeElement.classList).toContain('w-16');
  });
});
