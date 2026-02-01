import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { RegisterRequest, BasicInfoRequest } from '../../Models/Auth/auth.models';
import { AccountUserResponse } from '../../Models/User/user.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly baseUrl = Environment.API_URL;

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/AccountUser`, data);
  }

  setBasicInfo(info: BasicInfoRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/AccountUser/SetBasicInfo`, info);
  }

  getAccountUser(): Observable<AccountUserResponse> {
    return this.http.get<AccountUserResponse>(`${this.baseUrl}/api/AccountUser`);
  }
}
