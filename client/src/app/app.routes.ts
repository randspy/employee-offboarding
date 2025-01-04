import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'app/offboarding',
    pathMatch: 'full',
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layout/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'offboarding',
        loadChildren: () =>
          import('./features/offboarding/offboarding.routes').then(
            (m) => m.offboardingRoutes,
          ),
      },
    ],
  },
];
