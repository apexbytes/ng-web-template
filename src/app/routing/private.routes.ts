import { Routes } from '@angular/router';
import { DashboardLayout } from '@components/layouts/dashboard/dashboard.layout';
import { authGuard } from '@core/guards/auth.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('@components/pages/private/dashboard/dashboard.component').then(m => m.DashboardComponent),
        pathMatch: 'full',
        title: 'Dashboard',
      },
      {
        path: 'posts',
        loadComponent: () => import('@components/pages/private/posts/posts.component').then(m => m.PostsComponent),
        title: 'Posts',
      },
      {
        path: 'projects',
        loadComponent: () => import('@components/pages/private/projects/projects.component').then(m => m.ProjectsComponent),
        title: 'Projects',
      },
      {
        path: 'team',
        loadComponent: () => import('@components/pages/private/team/team.component').then(m => m.TeamComponent),
        title: 'Team',
      },
      {
        path: 'users',
        loadComponent: () => import('@components/pages/private/users/users.component').then(m => m.UsersComponent),
        title: 'Users',
      },
      {
        path: 'testimonials',
        loadComponent: () => import('@components/pages/private/testimonials/testimonials.component').then(m => m.TestimonialsComponent),
        title: 'Testimonials',
      },
    ]
  },
];
