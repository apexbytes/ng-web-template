import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-invite-form',
  imports: [ReactiveFormsModule],
  templateUrl: './invite-form.component.html',
  styleUrl: './invite-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteFormComponent {
  private readonly fb          = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly dialogRef   = inject(MatDialogRef<InviteFormComponent>);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role:  ['EDITOR' as 'ADMIN' | 'EDITOR', Validators.required],
  });

  get emailCtrl() { return this.form.controls['email']; }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { email, role } = this.form.getRawValue();

    this.authService.invite({ email: email!, role: role ?? undefined }).subscribe({
      next: () => {
        this.loading.set(false);
        this.dialogRef.close(true);
      },
      error: () => this.loading.set(false),
    });
  }
}
