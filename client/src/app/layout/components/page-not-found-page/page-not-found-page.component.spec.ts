import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundPageComponent } from './page-not-found-page.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import {
  DefaultRoute,
  DefaultRoutePageName,
} from '../../../core/shared/domain/routes.config';

describe('PageNotFoundPageComponent', () => {
  let component: PageNotFoundPageComponent;
  let fixture: ComponentFixture<PageNotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to default route on link click', async () => {
    const goToPageLink = fixture.debugElement.query(By.css('a'));

    expect(goToPageLink.nativeElement.textContent).toContain(
      `Go to ${DefaultRoutePageName}`,
    );

    expect(
      goToPageLink.nativeElement.attributes.getNamedItem(
        'ng-reflect-router-link',
      ).value,
    ).toContain(DefaultRoute);
  });
});
