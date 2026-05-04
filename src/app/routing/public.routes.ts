import { Routes } from '@angular/router';
import { PublicLayout } from '@components/layouts/public/public.layout';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('@components/pages/public/home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full',
        title: 'Home',
      },
      {
        path: 'about',
        loadComponent: () => import('@components/pages/public/about/about.component').then(m => m.AboutComponent),
        title: 'About',
      },
      {
        path: 'contact',
        loadComponent: () => import('@components/pages/public/contact/contact.component').then(m => m.ContactComponent),
        title: 'Contact',
      }
    ]
  },
];
