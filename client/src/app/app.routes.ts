import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'offboarding',
    pathMatch: 'full',
  },
  {
    path: 'offboarding',
    loadChildren: () =>
      import('./features/offboarding/offboarding.routes').then(
        (m) => m.offboardingRoutes,
      ),
  },
];
