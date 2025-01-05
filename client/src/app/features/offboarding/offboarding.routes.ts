import { Routes } from '@angular/router';
import { OffboardingEmployeeDetailPageComponent } from './components/offboarding-employee-detail-page/offboarding-employee-detail-page.component';
import { OffboardingDashboardPageComponent } from './components/offboarding-dashboard-page/offboarding-dashboard-page.component';

export const offboardingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OffboardingDashboardPageComponent,
      },
      {
        path: ':id',
        component: OffboardingEmployeeDetailPageComponent,
      },
    ],
  },
];
