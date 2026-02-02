import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Environment } from '../../../../environment/environment';
import { Observable, tap } from 'rxjs';
import { GetBoardDetailsResponse } from './board.models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private http = inject(HttpClient);
  private readonly baseUrl = Environment.API_URL;

  // Global state for the current board
  currentBoard = signal<GetBoardDetailsResponse | null>(null);

  // Keep track of the last requested year/month
  lastFilter = { year: 2026, month: 2 };

  // Loading state
  isLoading = signal<boolean>(false);

  getBoard(year: number, month: number): Observable<GetBoardDetailsResponse> {
    this.lastFilter = { year, month };
    const params = new HttpParams().set('year', year).set('month', month);

    this.isLoading.set(true);

    return this.http.get<GetBoardDetailsResponse>(`${this.baseUrl}/api/Board`, { params }).pipe(
      tap({
        next: (response) => {
          this.isLoading.set(false);
          // Check if response is "empty" based on user description (null fields)
          // The user said: "if it returns empty json... { totalObligationsAmount: null ... }"
          if (
            response &&
            response.totalObligationsAmount === null &&
            response.restAmount === null &&
            response.obligationInstances?.length === 0
          ) {
            // It's effectively empty/null for our purpose of "Board doesn't exist" logic
            this.currentBoard.set(null);
          } else {
            this.currentBoard.set(response);
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.currentBoard.set(null);
        },
      }),
    );
  }

  createBoard(year: number, month: number): Observable<any> {
    // return this.http.post(`${this.baseUrl}/api/Board`, { year, month });
    // User requested "If it returns empty json ... call Post api/Board with {year: 0, month:0}"
    // But then said "and show a + button to create board from it".
    // I will implement the simpler flow:
    // If empty -> currentBoard is null -> UI shows Button.
    // Button click -> createBoard(year, month) -> call API.

    return this.http.post(`${this.baseUrl}/api/Board`, { year, month }).pipe(
      tap(() => {
        // Refresh board after creation
        this.getBoard(year, month).subscribe();
      }),
    );
  }
}
