import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { WalletDto } from '../../../../Core/Services/Board/board.models';

@Component({
  selector: 'app-wallet-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet-grid.html',
  styleUrl: './wallet-grid.css',
})
export class WalletGrid {
  @Input() wallets: WalletDto[] = [];
  readonly langService = inject(LanguageService);
  get isAr() {
    return this.langService.isAr();
  }

  getTheme(category: number | string) {
    const catStr = typeof category === 'string' ? category.toLowerCase() : '';
    if (catStr.includes('cash') || category === 1) return 'green';
    if (catStr.includes('bank') || category === 2) return 'blue';
    return 'purple';
  }

  getIcon(category: number | string) {
    const catStr = typeof category === 'string' ? category.toLowerCase() : '';
    if (catStr.includes('cash') || category === 1) return 'bi-wallet-fill';
    if (catStr.includes('bank') || category === 2) return 'bi-bank2';
    return 'bi-credit-card-fill';
  }

  getCategoryLabel(category: number | string) {
    if (typeof category === 'number') {
      return category === 1 ? 'CASH' : category === 2 ? 'BANK' : 'OTHER';
    }
    return category;
  }

  getWalletBalance(wallet: WalletDto): number {
    return (wallet as any).balance || (wallet as any).amount || 2500;
  }

  getProgress(wallet: WalletDto) {
    const budget = this.getBudgetRaw(wallet);
    const balance = this.getWalletBalance(wallet);
    if (!budget) return 100;
    return Math.min(100, (balance / budget) * 100);
  }

  getBudget(wallet: WalletDto) {
    return this.getBudgetRaw(wallet).toLocaleString();
  }

  private getBudgetRaw(wallet: any) {
    // Mock budget for UI demo if not in DTO
    return wallet.budget || 5000;
  }
}
