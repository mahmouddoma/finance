import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountStore } from '../../../../Core/Services/account-store/account.store';

@Component({
  selector: 'app-obligation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './obligation-list.html',
  styleUrl: './obligation-list.css',
})
export class ObligationList implements OnInit {
  readonly langService = inject(LanguageService);
  protected accountStore = inject(AccountStore);

  ngOnInit() {}

  readonly obligations = computed(() => {
    const isAr = this.langService.isAr();
    const account = this.accountStore.account();

    if (!account?.listObligation) return [];

    const currency = isAr ? 'ج.م' : 'EGP';

    return account.listObligation.map((item) => ({
      title: item.title,
      type: item.type, // Keep original for styling checks
      typeLabel: this.getTypeLabel(item.type),
      amount: `${item.amount.toLocaleString()} ${currency}`,
      dueDay: item.dueDay,
      wallet: isAr ? item.wallet?.nameAr || 'غير محدد' : item.wallet?.nameEn || 'N/A',
      startDate: item.startDate,
      endDate: item.endDate,
    }));
  });

  private getTypeLabel(type: string): string {
    const isAr = this.langService.isAr();
    switch (type) {
      case 'FixedPayment':
        return isAr ? 'ثابت' : 'Fixed';
      case 'Installment':
        return isAr ? 'قسط' : 'Installment';
      case 'DebtPayment':
        return isAr ? 'دين' : 'Debt';
      case 'SafityPayment':
        return isAr ? 'توفير' : 'Savings';
      default:
        return type;
    }
  }

  getHeaders() {
    const isAr = this.langService.isAr();
    return [
      isAr ? 'العنوان' : 'Title',
      isAr ? 'النوع' : 'Type',
      isAr ? 'المبلغ' : 'Amount',
      isAr ? 'يوم الاستحقاق' : 'Due Day',
      isAr ? 'المحفظة' : 'Wallet',
      isAr ? 'يبدأ في' : 'Starts',
    ];
  }
}
