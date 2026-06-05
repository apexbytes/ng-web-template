import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SeoService } from '@core/services/seo.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService } from '@core/services/contact.service';
import { ApiError } from '@core/dto/api.models';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly seoService = inject(SeoService);
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  constructor() {
    this.seoService.set({
      title: 'Contact Us',
      description: 'Get in touch with GeoMapping Pty Ltd for professional surveying and geospatial services. Call +27 (0)72 944 5830 or send a message online. Branches in Mpumalanga and KwaZulu-Natal.',
      keywords: 'contact GeoMapping, survey company South Africa, mining survey enquiry, drone survey quote',
    });
  }

  readonly submitted = signal(false);
  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly validationErrors = signal<Record<string, string[]>>({});

  readonly serviceOptions = [
    { label: 'Mining Surveying & Planning', value: 'mining' },
    { label: 'Aerial Survey & GIS', value: 'aerial' },
    { label: 'Engineering Survey', value: 'engineering' },
    { label: 'Aerial Security Solutions', value: 'security' },
    { label: 'Community Programs', value: 'community' },
  ];

  readonly form = this.fb.group({
    fullname: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    city: ['', Validators.required],
    services: this.fb.array(this.serviceOptions.map(() => this.fb.control(false))),
    message: [''],
  });

  get servicesArray() {
    return this.form.controls.services;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullname, phone, email, city, services, message } = this.form.getRawValue();

    const selectedServices = this.serviceOptions
      .filter((_, i) => services[i])
      .map(o => o.label)
      .join(', ');

    this.loading.set(true);
    this.serverError.set(null);
    this.validationErrors.set({});

    this.contactService.send({
      name: fullname ?? '',
      email: email ?? '',
      phone: phone ?? undefined,
      city: city ?? undefined,
      subject: selectedServices || undefined,
      message: message ?? '',
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
        this.form.reset();
      },
      error: (err: ApiError) => {
        this.loading.set(false);
        if (err.code === 'VALIDATION_ERROR' && err.details) {
          this.validationErrors.set(err.details);
        } else {
          this.serverError.set(err.error);
        }
      },
    });
  }
}
