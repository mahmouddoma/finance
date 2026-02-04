import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { AccountApiService } from '../../Services/Account/account-api.service';
import { AccountUserResponse } from '../../Models/Account/account.models';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class AccountStore {
  private readonly api = inject(AccountApiService);

  private readonly _state = signal<LoadState>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _account = signal<AccountUserResponse | null>(null);

  readonly state = computed(() => this._state());
  readonly isLoading = computed(() => this._state() === 'loading');
  readonly error = computed(() => this._error());
  readonly account = computed(() => this._account());

  loadAccount() {
    this._state.set('loading');
    this._error.set(null);

    return this.api.getAccountUser().pipe(
      tap((data) => {
        this._account.set(data);
        this._state.set('success');
      }),
      catchError((err) => {
        this._account.set(null);
        this._state.set('error');
        this._error.set('Failed to fetch account data');
        return of(null);
      }),
      finalize(() => {}),
    );
  }
}
