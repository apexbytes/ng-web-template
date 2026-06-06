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
      },
      {
        path: 'mining-surveying-planning',
        loadComponent: () => import('@components/pages/public/msp/msp.component').then(m => m.MspComponent),
        title: 'Mining Surveying & Planning',
      },
      {
        path: 'aerial-survey-gis',
        loadComponent: () => import('@components/pages/public/asg/asg.component').then(m => m.AsgComponent),
        title: 'Aerial Survey & GIS',
      },
      {
        path: 'engineering-construction-survey',
        loadComponent: () => import('@components/pages/public/ecs/ecs.component').then(m => m.EcsComponent),
        title: 'Engineering & Construction Survey',
      },
      {
        path: 'aerial-security-solutions',
        loadComponent: () => import('@components/pages/public/ass/ass.component').then(m => m.AssComponent),
        title: 'Aerial Security Solutions',
      },
      {
        path: 'community-programs',
        loadComponent: () => import('@components/pages/public/cp/cp.component').then(m => m.CpComponent),
        title: 'Community Programs',
      },
      {
        path: 'blog',
        loadComponent: () => import('@components/pages/public/blogs/blogs.component').then(m => m.BlogsComponent),
        title: 'Blog',
      },
      {
        path: 'blog/:id',
        loadComponent: () => import('@components/pages/public/blog/blog.component').then(m => m.BlogComponent),
        title: 'Blog',
      },
      {
        path: 'projects',
        loadComponent: () => import('@components/pages/public/projects/projects.component').then(m => m.ProjectsComponent),
        title: 'Projects',
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('@components/pages/public/project/project.component').then(m => m.ProjectComponent),
        title: 'Project',
      },
    ]
  },
];
