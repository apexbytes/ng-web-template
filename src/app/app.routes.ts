import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./routing/public.routes').then(m => m.PUBLIC_ROUTES),
  },
  {
    path: 'd',
    loadChildren: () => import('./routing/private.routes').then(m => m.PRIVATE_ROUTES),
  },
];
