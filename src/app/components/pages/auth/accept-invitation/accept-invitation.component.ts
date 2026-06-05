import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  return pw && confirm && pw !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-accept-invitation',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptInvitationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly showPassword = signal(false);
  readonly showConfirm = signal(false);

  /** Email is display-only — pulled from the query param set by the invitation link */
  readonly invitedEmail = this.route.snapshot.queryParamMap.get('email') ?? '';
  private readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatch });

  togglePassword(): void { this.showPassword.update(v => !v); }
  toggleConfirm(): void { this.showConfirm.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fullName, password } = this.form.getRawValue();
    this.loading.set(true);

    this.authService.acceptInvitation({
      token: this.token,
      fullName: fullName!,
      password: password!,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Account created. Please sign in.', 'OK', {
          duration: 6000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/auth/login']);
      },
      error: () => this.loading.set(false),
    });
  }
}
