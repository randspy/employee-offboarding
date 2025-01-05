import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DefaultRoute,
  DefaultRoutePageName,
} from '../../../core/shared/domain/routes.config';
import { LinkComponent } from '../../../ui/components/link/link.component';

@Component({
  selector: 'eob-page-not-found-page',
  imports: [LinkComponent],
  templateUrl: './page-not-found-page.component.html',
  styleUrls: ['./page-not-found-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundPageComponent {
  routeUrl = DefaultRoute;
  pageName = DefaultRoutePageName;
}