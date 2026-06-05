import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '@core/api.token';
import { ApiListResponse, User } from '@core/dto/api.models';

export interface UsersQuery {
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  /** ADMIN only — returns a paginated list of all users (passwords excluded) */
  getAll(query: UsersQuery = {}) {
    const params: Record<string, string> = {};
    if (query.page  != null) params['page']  = String(query.page);
    if (query.limit != null) params['limit'] = String(query.limit);
    return this.http.get<ApiListResponse<User>>(`${this.apiUrl}/users`, { params });
  }

  /** ADMIN only — permanently deletes a user account; cannot delete your own account */
  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
