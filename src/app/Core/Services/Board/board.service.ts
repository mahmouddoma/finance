import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Environment } from '../../../../environment/environment';
import { Observable, tap } from 'rxjs';
import {
  AddTicketRequest,
  GetBoardDetailsResponse,
  PayObligationRequest,
  PayTicketRequest,
  TransferSafityRequest,
} from '../../Models/Board/board.models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = Environment.API_URL;

  getBoard(year: number, month: number): Observable<GetBoardDetailsResponse> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<GetBoardDetailsResponse>(`${this.baseUrl}/api/Board`, { params });
  }

  createBoard(year: number, month: number): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/Board`, { year, month });
  }

  addTicket(data: AddTicketRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/Board/AddTicket`, data);
  }

  paidTicket(data: PayTicketRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/Board/PaidTicket`, data);
  }

  payObligation(data: PayObligationRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/Board/payObligation`, data);
  }

  transferSafity(data: TransferSafityRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/Board/TransferSafity`, data);
  }
}
