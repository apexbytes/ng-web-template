import { Routes } from '@angular/router';
import { AuthLayout } from '@components/layouts/auth/auth.layout';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () => import('@components/pages/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Login',
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('@components/pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'Forgot Password',
      },
      {
        path: 'reset-password',
        loadComponent: () => import('@components/pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        title: 'Reset Password',
      },
      {
        path: 'accept-invitation',
        loadComponent: () => import('@components/pages/auth/accept-invitation/accept-invitation.component').then(m => m.AcceptInvitationComponent),
        title: 'Accept Invitation',
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
