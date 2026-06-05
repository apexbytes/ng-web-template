import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/api.token';
import { ApiListResponse, ApiResponse, Project, ProjectTag } from '@core/dto/api.models';

export interface ProjectsQuery {
  tag?: ProjectTag;
  page?: number;
  limit?: number;
}

export interface CreateProjectPayload {
  title: string;
  content: string;
  tag?: ProjectTag;
  sortOrder?: number;
  image?: File;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getAll(query: ProjectsQuery = {}) {
    return this.http.get<ApiListResponse<Project>>(`${this.apiUrl}/projects`, { params: this.buildParams(query as unknown as Record<string, unknown>) });
  }

  getById(id: string) {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`);
  }

  create(payload: CreateProjectPayload) {
    return this.http.post<ApiResponse<Project>>(`${this.apiUrl}/projects`, this.toFormData(payload as unknown as Record<string, unknown>));
  }

  update(id: string, payload: Partial<CreateProjectPayload>) {
    return this.http.put<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`, this.toFormData(payload as unknown as Record<string, unknown>));
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
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

  private buildParams(query: Record<string, unknown>): Record<string, string> {
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(query)) {
      if (value != null) params[key] = String(value);
    }
    return params;
  }
}
