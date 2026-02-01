import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Environment } from '../../../../environment/environment';
import { CreateObligationRequest } from '../../Models/Obligation/obligation.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObligationService {
  private http = inject(HttpClient);
  private baseUrl = Environment.API_URL;

  createFixedPayment(request: CreateObligationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/ObligationDefinition/CreateFixedPayment`, request);
  }

  createDebtPayment(request: CreateObligationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/ObligationDefinition/CreateDebtPayment`, request);
  }

  createInstallment(request: CreateObligationRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/ObligationDefinition/CreateInstallment`, request);
  }
}
