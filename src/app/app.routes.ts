import { Routes } from '@angular/router';

export const routes: Routes = [
  // Auth routes — /auth/login, etc. (must be before the empty-path catch-all)
  {
    path: 'auth',
    loadChildren: () => import('./routing/auth.routes').then(m => m.AUTH_ROUTES),
  },
  // Private routes — /d/dashboard, etc.
  {
    path: 'd',
    loadChildren: () => import('./routing/private.routes').then(m => m.PRIVATE_ROUTES),
  },
  // Public routes — /, /about, /contact, /services, etc. (empty-path catch-all last)
  {
    path: '',
    loadChildren: () => import('./routing/public.routes').then(m => m.PUBLIC_ROUTES),
  },
];
