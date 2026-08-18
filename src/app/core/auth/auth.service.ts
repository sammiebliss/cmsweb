import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}

interface LoginResponse {
  token: string;
  token_type: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storageKey = 'dc_cms_token';
  private readonly userKey = 'dc_cms_user';

  readonly token = signal<string | null>(this.readToken());
  readonly user = signal<AuthUser | null>(this.readUser());
  readonly isAuthenticated = computed(() => !!this.token());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password, device_name: 'cms-web' })
      .pipe(
        tap((res) => {
          this.token.set(res.token);
          this.user.set(res.user);
          localStorage.setItem(this.storageKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
        }),
      );
  }

  me(): Observable<{ data: AuthUser } | AuthUser> {
    return this.http.get<{ data: AuthUser } | AuthUser>(`${environment.apiUrl}/auth/me`).pipe(
      tap((res) => {
        const user = 'data' in res ? res.data : res;
        this.user.set(user);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }),
    );
  }

  logout(): void {
    const token = this.token();
    if (token) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => undefined });
    }
    this.clear();
    this.router.navigateByUrl('/admin/login');
  }

  hasPermission(permission: string): boolean {
    const user = this.user();
    if (!user) {
      return false;
    }
    if (user.roles?.includes('Super Admin') || user.roles?.includes('Administrator')) {
      return true;
    }
    return !!user.permissions?.includes(permission);
  }

  private clear(): void {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
  }

  private readToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
  }

  private readUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
