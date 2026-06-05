import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/api.token';
import { ApiListResponse, ApiResponse, Post, PostStatus } from '@core/dto/api.models';

export interface PostsQuery {
  status?: PostStatus;
  page?: number;
  limit?: number;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  status?: PostStatus;
  image?: File;
}

export interface UpdatePostPayload extends Partial<Omit<CreatePostPayload, 'image'>> {
  image?: File;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getAll(query: PostsQuery = {}) {
    return this.http.get<ApiListResponse<Post>>(`${this.apiUrl}/posts`, { params: this.buildParams(query as unknown as Record<string, unknown>) });
  }

  getById(id: string) {
    return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/posts/${id}`);
  }

  create(payload: CreatePostPayload) {
    return this.http.post<ApiResponse<Post>>(`${this.apiUrl}/posts`, this.toFormData(payload as unknown as Record<string, unknown>));
  }

  update(id: string, payload: UpdatePostPayload) {
    return this.http.put<ApiResponse<Post>>(`${this.apiUrl}/posts/${id}`, this.toFormData(payload as unknown as Record<string, unknown>));
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
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
