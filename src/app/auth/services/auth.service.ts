import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoginResponse, UserData } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<UserData | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  // checkStatusResource = rxResource({
  //   loader: () => this.checkAuthStatus(),
  // });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user() && this._token()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<UserData | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  isAdmin = computed(() => {
    return this._user()?.role.includes('ROLE_ADMIN') ?? false;
  });

  login(usernameOrEmail: string, password: string): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${baseUrl}/auth/login`, { usernameOrEmail, password })
      .pipe(
        map((resp) => this.handerLoginSuccess(resp))
        // catchError((error: any) => this.handleLoginError(error))
      );
  }
  logoutAndReload() {
    this.logout();
    // location.reload();
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<LoginResponse>(`${baseUrl}/auth/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        map((resp) => this.handerLoginSuccess(resp)),
        catchError((error: any) => this.handleLoginError(error))
      );
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }
  private handerLoginSuccess(resp: LoginResponse) {
    this._authStatus.set('authenticated');
    this._user.set(resp.data);
    this._token.set(resp.data.access_token);
    localStorage.setItem('token', resp.data.access_token);
    console.log(resp);

    return true;
  }
  private handleLoginError(error: any) {
    this.logout();
    return of(false);
  }
}
