import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environment/environment';
import { BasicInfoRequest, RegisterRequest } from '../../Models/Auth/auth.models';
import { AccountUserResponse } from '../../Models/User/user.models';

@Injectable({ providedIn: 'root' })
export class AccountApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = Environment.API_URL;

  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/AccountUser`, data);
  }

  setBasicInfo(info: BasicInfoRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/AccountUser/SetBasicInfo`, info);
  }

  getAccountUser(): Observable<AccountUserResponse> {
    return this.http.get<AccountUserResponse>(`${this.baseUrl}/api/AccountUser`);
  }
}
