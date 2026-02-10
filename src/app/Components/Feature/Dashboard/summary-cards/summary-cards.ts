import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountUserResponse } from '../../../../Core/Models/User/user.models';
import { AccountStore } from '../../../../Core/Services/account-store/account.store';

type CardColor = 'red' | 'orange' | 'green';

interface SummaryCardVm {
  title: string;
  amountValue: string;
  currency: string;
  icon: string;
  color?: CardColor;
  note: string;
  isPositive: boolean;
  isDark: boolean;
}

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards implements OnInit {
  readonly langService = inject(LanguageService);
  private readonly accountStore = inject(AccountStore);

  ngOnInit(): void {
    // Data is loaded by parent or store
  }

  private readonly accountData = this.accountStore.account;

  private readonly currency = computed(() => (this.langService.isAr() ? 'ج.م' : 'EGP'));

  private readonly cashBalance = computed(() => {
    return this.accountData()?.monthlyCashBalance ?? 0;
  });

  private readonly totalExpenses = computed(() => {
    return this.accountData()?.totalObligationsAmount ?? 0;
  });

  private readonly safetyBalance = computed(() => this.accountData()?.bankBalance ?? 0);

  private readonly netWealth = computed(() => this.accountData()?.netWealth ?? 0);

  readonly cards = computed<SummaryCardVm[]>(() => {
    const isAr = this.langService.isAr();
    const currency = this.currency();

    return [
      {
        title: isAr ? 'الرصيد الشهري' : 'Monthly Cash Balance',
        amountValue: this.cashBalance().toLocaleString(),
        currency,
        icon: 'bi-briefcase-fill',
        note: isAr ? 'إجمالي المتاح' : 'Total available',
        isPositive: true,
        isDark: true,
      },
      {
        title: isAr ? 'إجمالي الالتزامات' : 'Total Obligations',
        amountValue: this.totalExpenses().toLocaleString(),
        currency,
        icon: 'bi-graph-down',
        color: 'red',
        note: isAr ? 'لهذا الشهر' : 'For this month',
        isPositive: false,
        isDark: false,
      },
      {
        title: isAr ? 'صافي الثروة' : 'Net Wealth',
        amountValue: this.netWealth().toLocaleString(),
        currency,
        icon: 'bi-pie-chart-fill',
        color: 'orange',
        note: isAr ? 'صافي الأصول' : 'Net assets value',
        isPositive: true,
        isDark: false,
      },
      {
        title: isAr ? 'رصيد البنك' : 'Bank Balance',
        amountValue: this.safetyBalance().toLocaleString(),
        currency,
        icon: 'bi-shield-fill-check',
        color: 'green',
        note: isAr ? 'رصيد مؤمن' : 'Secured balance',
        isPositive: true,
        isDark: false,
      },
    ];
  });
}
