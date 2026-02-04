import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Environment } from '../../../../environment/environment';
import { Observable, tap } from 'rxjs';
import { GetBoardDetailsResponse } from './board.models';

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
}
