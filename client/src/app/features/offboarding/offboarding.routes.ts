import { Routes } from '@angular/router';
import { OffboardingEmployeeDetailPageComponent } from './components/offboarding-employee-detail-page/offboarding-employee-detail-page.component';
import { OffboardingDashboardPageComponent } from './components/offboarding-dashboard-page/offboarding-dashboard-page.component';
import { EmployeeService } from './services/employee.service';
import { EmployeesStore } from './stores/employees.store';

export const offboardingRoutes: Routes = [
  {
    path: '',
    providers: [EmployeeService, EmployeesStore],
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
