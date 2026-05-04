import { Routes } from '@angular/router';
import { DashboardLayout } from '@components/layouts/dashboard/dashboard.layout';

export const PRIVATE_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('@components/pages/private/dashboard/dashboard.component').then(m => m.DashboardComponent),
        pathMatch: 'full',
        title: 'Dashboard',
      }
    ]
  },
];
