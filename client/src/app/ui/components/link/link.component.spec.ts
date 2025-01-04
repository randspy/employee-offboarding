import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponent } from './link.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('link', '/url');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render link with correct link', () => {
    expect(linkElement().getAttribute('href')).toBe('/url');
  });

  const linkElement = () =>
    fixture.debugElement.query(By.css('a')).nativeElement;
});
