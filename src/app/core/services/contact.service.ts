import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/api.token';
import { ApiListResponse, ApiResponse, ContactMessage, MessageStatus } from '@core/dto/api.models';

export interface SendMessagePayload {
  name: string;
  email: string;
  subject?: string;
  phone?: string;
  city?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  send(payload: SendMessagePayload) {
    return this.http.post<ApiResponse<ContactMessage>>(`${this.apiUrl}/contact`, payload);
  }

  getAll(query: { status?: MessageStatus; page?: number; limit?: number } = {}) {
    const params: Record<string, string> = {};
    if (query.status) params['status'] = query.status;
    if (query.page != null) params['page'] = String(query.page);
    if (query.limit != null) params['limit'] = String(query.limit);
    return this.http.get<ApiListResponse<ContactMessage>>(`${this.apiUrl}/contact`, { params });
  }

  updateStatus(id: string, status: MessageStatus) {
    return this.http.patch<ApiResponse<ContactMessage>>(`${this.apiUrl}/contact/${id}`, { status });
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/contact/${id}`);
  }
}
