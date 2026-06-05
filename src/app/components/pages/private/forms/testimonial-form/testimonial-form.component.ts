import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestimonialsService } from '@core/services/testimonials.service';
import { Testimonial } from '@core/dto/api.models';

interface TestimonialDialogData {
  testimonial?: Testimonial;
}

@Component({
  selector: 'app-testimonial-form',
  imports: [ReactiveFormsModule],
  templateUrl: './testimonial-form.component.html',
  styleUrl: './testimonial-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly testimonialsService = inject(TestimonialsService);
  private readonly dialogRef = inject(MatDialogRef<TestimonialFormComponent>);
  private readonly data = inject<TestimonialDialogData>(MAT_DIALOG_DATA) ?? {};

  readonly isEdit = !!this.data.testimonial;
  readonly loading = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal<string | null>(this.data.testimonial?.imageUrl ?? null);

  readonly form = this.fb.group({
    name:      [this.data.testimonial?.name      ?? '', [Validators.required, Validators.minLength(2)]],
    testimony: [this.data.testimonial?.testimony ?? '', [Validators.required, Validators.minLength(10)]],
    isActive:  [this.data.testimonial?.isActive  ?? true],
    sortOrder: [this.data.testimonial?.sortOrder ?? 0, [Validators.required, Validators.min(0)]],
  });

  get nameCtrl()      { return this.form.controls['name']; }
  get testimonyCtrl() { return this.form.controls['testimony']; }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile.set(file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(this.data.testimonial?.imageUrl ?? null);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { name, testimony, isActive, sortOrder } = this.form.getRawValue();
    const file = this.selectedFile();
    const payload = {
      name: name!,
      testimony: testimony!,
      isActive: isActive ?? true,
      sortOrder: Number(sortOrder),
      ...(file ? { image: file } : {}),
    };

    const request$ = this.isEdit
      ? this.testimonialsService.update(this.data.testimonial!.id, payload)
      : this.testimonialsService.create(payload);

    request$.subscribe({
      next:  () => { this.loading.set(false); this.dialogRef.close(true); },
      error: () => this.loading.set(false),
    });
  }
}
