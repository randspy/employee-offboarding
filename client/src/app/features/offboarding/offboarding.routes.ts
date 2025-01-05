import { Routes } from '@angular/router';
import { OffboardingPageComponent } from './components/offboarding-page/offboarding-page.component';
import { OffboardEmployeePageComponent } from './components/offboard-employee-page/offboard-employee-page.component';

export const offboardingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OffboardingPageComponent,
      },
      {
        path: ':id',
        component: OffboardEmployeePageComponent,
      },
    ],
  },
];
