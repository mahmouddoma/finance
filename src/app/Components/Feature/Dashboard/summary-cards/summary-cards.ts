import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountService } from '../../../../Core/Services/Account/account.service';
import { BoardService } from '../../../../Core/Services/Board/board.service';
import { AccountUserResponse } from '../../../../Core/Models/User/user.models';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards implements OnInit {
  readonly langService = inject(LanguageService);
  private accountService = inject(AccountService);
  protected boardService = inject(BoardService);

  accountData = signal<AccountUserResponse | null>(null);

  ngOnInit() {
    this.accountService.getAccountUser().subscribe({
      next: (data) => this.accountData.set(data),
      error: (err) => console.error('Failed to fetch account data', err),
    });
  }

  readonly cards = computed(() => {
    const isAr = this.langService.isAr();
    const data = this.accountData();
    const board = this.boardService.currentBoard();
    const currency = isAr ? 'ج.م' : 'EGP';

    return [
      {
        title: isAr ? 'المتاح الصافي' : 'Net Liquidity',
        amountValue: board
          ? board.monthlyCashBalance.toLocaleString()
          : data
            ? data.monthlyCashBalance.toLocaleString()
            : '0',
        currency: currency,
        icon: 'bi-briefcase-fill',
        color: 'white',
        note: isAr ? 'إجمالي المتاح' : 'Total available',
        isPositive: true,
      },
      {
        title: isAr ? 'إجمالي المصروفات' : 'Total Expenses',
        amountValue:
          board?.totalObligationsAmount !== undefined
            ? board.totalObligationsAmount?.toLocaleString()
            : data
              ? data.totalObligationsAmount.toLocaleString()
              : '0',
        currency: currency,
        icon: 'bi-graph-down',
        color: 'red',
        note: isAr ? 'لهذا الشهر' : 'For this month',
        isPositive: false,
      },
      {
        title: isAr ? 'متوسط الصرف اليومي' : 'Daily Avg Spend',
        amountValue: '350',
        currency: currency,
        icon: 'bi-clock-fill',
        color: 'orange',
        note: isAr ? 'تقديري' : 'Estimated',
        isPositive: true,
      },
      {
        title: isAr ? 'رصيد الأمان' : 'Safety Balance',
        amountValue: board?.restAmount ? board.restAmount.toLocaleString() : '0',
        currency: currency,
        icon: 'bi-shield-fill-check',
        color: 'green',
        note: isAr ? 'رصيد مؤمن' : 'Secured balance',
        isPositive: true,
      },
    ];
  });
}
