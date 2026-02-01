import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountService } from '../../../../Core/Services/Account/account.service';
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

    const currency = isAr ? 'ج.م' : 'EGP';

    return [
      {
        title: isAr ? 'رصيد البنك' : 'Bank Balance',
        amount: data ? `${data.bankBalance.toLocaleString()} ${currency}` : '...',
        note: isAr ? '+2.5% من الشهر الماضي' : '+2.5% from last month',
        icon: 'bi-bank',
        color: 'primary',
      },
      {
        title: isAr ? 'النقد الشهري' : 'Monthly Cash',
        amount: data ? `${data.monthlyCashBalance.toLocaleString()} ${currency}` : '...',
        note: isAr ? 'السيولة المتاحة' : 'Available liquidity',
        icon: 'bi-wallet2',
        color: 'success',
      },
      {
        title: isAr ? 'صافي الثروة' : 'Net Wealth',
        amount: data ? `${data.netWealth.toLocaleString()} ${currency}` : '...',
        note: isAr ? 'تنمو بثبات' : 'Growing steadily',
        icon: 'bi-graph-up-arrow',
        color: 'purple',
      },
      {
        title: isAr ? 'إجمالي الالتزامات' : 'Total Obligations',
        amount: data ? `${data.totalObligationsAmount.toLocaleString()} ${currency}` : '...',
        note: isAr ? 'مستحق هذا الشهر' : 'Due this month',
        icon: 'bi-exclamation-circle',
        color: 'danger',
      },
    ];
  });
}
