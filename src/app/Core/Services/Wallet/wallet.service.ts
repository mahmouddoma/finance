import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environment/environment';
import { WalletMinimalDto } from '../../Models/Board/board.models';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = Environment.API_URL;

  getWallets(): Observable<WalletMinimalDto[]> {
    return this.http.get<WalletMinimalDto[]>(`${this.baseUrl}/api/Wallet`);
  }
}
