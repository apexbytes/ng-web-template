import { Injectable, computed, signal } from '@angular/core';
import { User } from '@core/dto/api.models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function readStoredUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as User | null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly user = signal<User | null>(readStoredUser());

  readonly isAuthenticated = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');
  readonly isEditor = computed(
    () => this.user()?.role === 'EDITOR' || this.user()?.role === 'ADMIN'
  );

  setAuth(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.token.set(token);
    this.user.set(user);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.user.set(null);
  }
}
