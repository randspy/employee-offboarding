import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundPageComponent } from './page-not-found-page.component';
import { provideRouter } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  DefaultRoute,
  DefaultRoutePageName,
} from '../../../core/shared/domain/routes.config';
import { LinkComponentHarness } from '../../../../tests/harness/ui/link.harness';

describe('PageNotFoundPageComponent', () => {
  let component: PageNotFoundPageComponent;
  let fixture: ComponentFixture<PageNotFoundPageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundPageComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to default route on link click', async () => {
    const link = await loader.getHarness(LinkComponentHarness);

    expect(await link.getLink()).toBe(DefaultRoute);
    expect(await link.getText()).toBe(`Go to ${DefaultRoutePageName}`);
  });
});
