import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountService } from '../../../../Core/Services/Account/account.service';
import { ObligationView } from '../../../../Core/Models/User/user.models';

@Component({
  selector: 'app-obligation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './obligation-list.html',
  styleUrl: './obligation-list.css',
})
export class ObligationList implements OnInit {
  readonly langService = inject(LanguageService);
  private accountService = inject(AccountService);

  obligationList = signal<ObligationView[]>([]);

  ngOnInit() {
    this.accountService.getAccountUser().subscribe({
      next: (data) => this.obligationList.set(data.listObligation || []),
      error: (err) => console.error('Failed to fetch obligations', err),
    });
  }

  readonly obligations = computed(() => {
    const isAr = this.langService.isAr();
    const list = this.obligationList();
    const currency = isAr ? 'ج.م' : 'EGP';

    return list.map((item) => ({
      title: item.title,
      type: item.type, // 'FixedPayment' | 'Installment' | 'Debt'
      typeAr: this.getTypeAr(item.type),
      amount: `${item.amount.toLocaleString()} ${currency}`,
      dueDay: item.dueDay,
      wallet: isAr ? item.wallet?.nameAr || 'غير محدد' : item.wallet?.nameEn || 'N/A',
      period: `${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`,
    }));
  });

  private getTypeAr(type: string): string {
    switch (type) {
      case 'FixedPayment':
        return 'ثابت';
      case 'Installment':
        return 'قسط';
      case 'Debt':
        return 'دين';
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
      isAr ? 'الفترة' : 'Period',
    ];
  }
}
