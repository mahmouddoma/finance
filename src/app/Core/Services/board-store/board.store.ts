import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { GetBoardDetailsResponse } from '../../Models/Board/board.models';
import { BoardService } from '../Board/board.service';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

function isEmptyBoard(r: GetBoardDetailsResponse | null | undefined): boolean {
  if (!r) return true;
  const emptyObligations = (r as any).obligationInstances?.length === 0;
  return r.totalObligationsAmount === null && r.restAmount === null && emptyObligations;
}

@Injectable({ providedIn: 'root' })
export class BoardStore {
  private readonly api = inject(BoardService);

  private readonly _state = signal<LoadState>('idle');
  private readonly _error = signal<string | null>(null);

  readonly currentBoard = signal<GetBoardDetailsResponse | null>(null);

  readonly lastFilter = signal<{ year: number; month: number }>({ year: 2026, month: 2 });

  readonly state = computed(() => this._state());
  readonly isLoading = computed(() => this._state() === 'loading');
  readonly error = computed(() => this._error());

  loadBoard(year: number, month: number) {
    this.lastFilter.set({ year, month });
    this._state.set('loading');
    this._error.set(null);

    return this.api.getBoard(year, month).pipe(
      map((res) => (isEmptyBoard(res) ? null : res)),
      tap((board) => {
        this.currentBoard.set(board);
        this._state.set('success');
      }),
      catchError(() => {
        this.currentBoard.set(null);
        this._state.set('error');
        this._error.set('Failed to fetch board');
        return of(null);
      }),
      finalize(() => {}),
    );
  }

  createBoardForLastFilter() {
    const { year, month } = this.lastFilter();
    this._state.set('loading');
    this._error.set(null);

    return this.api.createBoard(year, month).pipe(
      switchMap(() => this.loadBoard(year, month)),
      catchError(() => {
        this._state.set('error');
        this._error.set('Failed to create board');
        return of(null);
      }),
      finalize(() => {}),
    );
  }
}
