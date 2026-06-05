import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_URL } from '@core/api.token';
import { AuthStore } from '@core/stores/auth.store';
import { ApiResponse, LoginResponse, User } from '@core/dto/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly authStore = inject(AuthStore);

  /** ADMIN only — sends an invitation email to the given address */
  invite(payload: { email: string; role?: 'ADMIN' | 'EDITOR' }) {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/auth/invite`, payload);
  }

  /** ADMIN only — cancels a pending invitation */
  revokeInvitation(email: string) {
    return this.http.delete<void>(`${this.apiUrl}/auth/invite/${encodeURIComponent(email)}`);
  }

  /** Public — invitee sets their name and password using the token from the email link */
  acceptInvitation(payload: { token: string; fullName: string; password: string }) {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/auth/accept-invitation`, payload);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap(({ data: { token, user } }) => this.authStore.setAuth(token, user))
    );
  }

  forgotPassword(email: string) {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(payload: { token: string; newPassword: string }) {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/auth/reset-password`, payload);
  }

  logout(): void {
    this.authStore.logout();
  }
}
