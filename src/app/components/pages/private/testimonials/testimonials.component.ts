import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { TestimonialsService } from '@core/services/testimonials.service';
import { Testimonial } from '@core/dto/api.models';
import { TestimonialFormComponent } from '../forms/testimonial-form/testimonial-form.component';
import { ConfirmDialogComponent } from '../forms/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  private readonly testimonialsService = inject(TestimonialsService);
  private readonly dialog = inject(MatDialog);

  readonly testimonialsResource = rxResource({
    stream: () => this.testimonialsService.getAll(),
  });

  readonly testimonials = computed(() => this.testimonialsResource.value()?.data ?? []);

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');
  }

  truncate(text: string, max = 80): string {
    if (text.length <= max) return text;
    return text.slice(0, text.lastIndexOf(' ', max) || max) + '…';
  }

  private openForm(testimonial?: Testimonial): void {
    const ref = this.dialog.open(TestimonialFormComponent, {
      disableClose: true,
      maxHeight: '90vh',
      maxWidth: '1400px',
      width: '95%',
      panelClass: 'full-screen-modal',
      data: testimonial ? { testimonial } : undefined,
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) this.testimonialsResource.reload();
    });
  }

  openCreate(): void { this.openForm(); }
  openEdit(testimonial: Testimonial): void { this.openForm(testimonial); }

  delete(testimonial: Testimonial): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'full-screen-modal',
      width: '90%',
      maxWidth: '400px',
      data: { message: `Delete testimonial from "${testimonial.name}"? This cannot be undone.` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.testimonialsService.delete(testimonial.id).subscribe({
        next: () => this.testimonialsResource.reload(),
      });
    });
  }
}
