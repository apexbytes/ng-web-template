import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '@core/stores/auth.store';
import { ApiError } from '@core/dto/api.models';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const apiError: ApiError = (err.error as ApiError) ?? {
        error: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };

      snackBar.open(apiError.error, 'Dismiss', {
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });

      if (err.status === 401) {
        authStore.logout();
        router.navigate(['/auth/login']);
      }

      return throwError(() => apiError);
    })
  );
};
