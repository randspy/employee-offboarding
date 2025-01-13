import { TestBed } from '@angular/core/testing';

import { PageNotFoundPageComponent } from './page-not-found-page.component';
import { provideRouter } from '@angular/router';
import {
  DefaultRoute,
  DefaultRoutePageName,
} from '../../../core/shared/domain/routes.config';

import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { RouterTestingHarness } from '@angular/router/testing';
import { DummyComponent } from '../../../../tests/dummy-component';

async function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: DefaultRoute.slice(1), component: DummyComponent },
        { path: '**', component: PageNotFoundPageComponent },
      ]),
    ],
  });

  const user = userEvent.setup();
  const harness = await RouterTestingHarness.create('/some-random-url');

  return {
    harness,
    user,
  };
}

describe('PageNotFoundPageComponent', () => {
  it('should redirect to default route on link click', async () => {
    const { harness, user } = await setup();

    const goToPageLink = screen.getByRole('link', {
      name: `Go to ${DefaultRoutePageName}`,
    });

    await user.click(goToPageLink);

    expect(harness.routeDebugElement!.componentInstance).toBeInstanceOf(
      DummyComponent,
    );
  });
});
