import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../../environment/environment';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, OTPVerifyRequest } from '../../Models/Auth/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = Environment.API_URL;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/Auth/Login`, credentials).pipe(
      tap((response) => {
        if (response.token && response.token.token) {
          localStorage.setItem('auth_token', response.token.token);
          localStorage.setItem('user_info', JSON.stringify(response.token));
        }
      }),
    );
  }

  requestOTP(): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/EmailVerification/RequestOTP`, {});
  }

  verifyOTP(code: string): Observable<any> {
    const payload: OTPVerifyRequest = { code };
    return this.http.post(`${this.baseUrl}/api/EmailVerification/VerifyOTP`, payload);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
}
