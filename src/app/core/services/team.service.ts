import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/api.token';
import { ApiResponse, Social, TeamMember } from '@core/dto/api.models';

export interface CreateMemberPayload {
  name: string;
  title: string;
  socials?: Social[];
  sortOrder?: number;
  image?: File;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getAll() {
    return this.http.get<{ data: TeamMember[] }>(`${this.apiUrl}/team`);
  }

  create(payload: CreateMemberPayload) {
    const body = payload.image ? this.toFormData(payload as unknown as Record<string, unknown>) : payload;
    return this.http.post<ApiResponse<TeamMember>>(`${this.apiUrl}/team`, body);
  }

  update(id: string, payload: Partial<CreateMemberPayload>) {
    const body = payload.image ? this.toFormData(payload as unknown as Record<string, unknown>) : payload;
    return this.http.patch<ApiResponse<TeamMember>>(`${this.apiUrl}/team/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/team/${id}`);
  }

  private toFormData(payload: Record<string, unknown>): FormData {
    const form = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (value == null) continue;
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (item instanceof File) {
            form.append(`${key}[${i}]`, item);
          } else if (typeof item === 'object' && item !== null) {
            for (const [subKey, subVal] of Object.entries(item as Record<string, unknown>)) {
              if (subVal != null) form.append(`${key}[${i}][${subKey}]`, String(subVal));
            }
          } else {
            form.append(`${key}[${i}]`, String(item));
          }
        });
      } else if (value instanceof File) {
        form.append(key, value);
      } else {
        form.append(key, String(value));
      }
    }
    return form;
  }
}
