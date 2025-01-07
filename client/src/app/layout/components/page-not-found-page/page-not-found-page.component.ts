import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DefaultRoute,
  DefaultRoutePageName,
} from '../../../core/shared/domain/routes.config';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'eob-page-not-found-page',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './page-not-found-page.component.html',
  styleUrls: ['./page-not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundPageComponent {
  routeUrl = DefaultRoute;
  pageName = DefaultRoutePageName;
}
