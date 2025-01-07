import { Routes } from '@angular/router';
import { OffboardingEmployeeDetailPageComponent } from './components/offboarding-employee-detail-page/offboarding-employee-detail-page.component';
import { OffboardingDashboardPageComponent } from './components/offboarding-dashboard-page/offboarding-dashboard-page.component';
import { EmployeeService } from './services/employee.service';
import { EmployeesStore } from './stores/employees.store';
import { UserService } from './services/user.service';
import { UsersStore } from './stores/users.store';

export const offboardingRoutes: Routes = [
  {
    path: '',
    providers: [EmployeeService, EmployeesStore, UserService, UsersStore],
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
