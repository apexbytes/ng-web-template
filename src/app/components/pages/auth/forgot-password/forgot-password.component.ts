import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { email } = this.form.getRawValue();
    this.authService.forgotPassword(email!).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
        this.snackBar.open('Reset link sent — check your inbox.', 'OK', {
          duration: 6000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      },
      error: () => this.loading.set(false),
    });
  }
}
