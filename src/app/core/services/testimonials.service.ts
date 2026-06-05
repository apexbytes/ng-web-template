import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/api.token';
import { ApiResponse, Testimonial } from '@core/dto/api.models';

export interface CreateTestimonialPayload {
  name: string;
  testimony: string;
  isActive?: boolean;
  sortOrder?: number;
  image?: File;
}

export type UpdateTestimonialPayload = Partial<CreateTestimonialPayload>;

@Injectable({ providedIn: 'root' })
export class TestimonialsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getAll() {
    return this.http.get<{ data: Testimonial[] }>(`${this.apiUrl}/testimonials`);
  }

  create(payload: CreateTestimonialPayload) {
    return this.http.post<ApiResponse<Testimonial>>(`${this.apiUrl}/testimonials`, this.toFormData(payload as unknown as Record<string, unknown>));
  }

  update(id: string, payload: UpdateTestimonialPayload) {
    return this.http.patch<ApiResponse<Testimonial>>(`${this.apiUrl}/testimonials/${id}`, this.toFormData(payload as unknown as Record<string, unknown>));
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/testimonials/${id}`);
  }

  private toFormData(payload: Record<string, unknown>): FormData {
    const form = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (value == null) continue;
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    }
    return form;
  }
}
