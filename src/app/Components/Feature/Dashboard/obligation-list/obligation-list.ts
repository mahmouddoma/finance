import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountService } from '../../../../Core/Services/Account/account.service';
import { ObligationView } from '../../../../Core/Models/User/user.models';
import { BoardStore } from '../../../../Core/Services/board-store/board.store';

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
  protected boardService = inject(BoardStore);

  obligationList = signal<any[]>([]);

  ngOnInit() {
    // Initial fetch if needed, though Dashboard now manages board fetch via sidebar
  }

  readonly obligations = computed(() => {
    const isAr = this.langService.isAr();
    const board = this.boardService.currentBoard();

    if (!board) return [];

    const currency = isAr ? 'ج.م' : 'EGP';

    // Combine instances and tickets
    const instances = board.obligationInstances.map((item) => ({
      title: item.title,
      type: this.getTypeEn(item.type),
      typeAr: this.getTypeAr(item.type),
      amount: `${item.amount.toLocaleString()} ${currency}`,
      dueDay: this.parseDueDay(item.dueDate),
      wallet: isAr ? item.wallet?.nameAr || 'غير محدد' : item.wallet?.nameEn || 'N/A',
      period: item.dueDate,
      status: item.status,
    }));

    const tickets = board.tickets.map((item) => ({
      title: item.title,
      type: isAr ? 'تذكرة' : 'Ticket',
      typeAr: 'تذكرة',
      amount: item.amount ? `${item.amount.toLocaleString()} ${currency}` : '—',
      dueDay: this.parseDueDay(item.dueDate),
      wallet: isAr ? item.wallet?.nameAr || 'غير محدد' : item.wallet?.nameEn || 'N/A',
      period: item.dueDate,
      status: item.status,
    }));

    return [...instances, ...tickets];
  });

  private parseDueDay(dateStr: string): string | number {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '—' : date.getDate();
  }

  private getTypeEn(type: any): string {
    const typeStr = String(type);
    switch (typeStr) {
      case '1':
      case 'FixedPayment':
        return 'FixedPayment';
      case '2':
      case 'Installment':
        return 'Installment';
      case '3':
      case 'DebtPayment':
        return 'DebtPayment';
      case '4':
      case 'SafityPayment':
        return 'SafityPayment';
      default:
        return 'FixedPayment';
    }
  }

  private getTypeAr(type: any): string {
    const typeStr = String(type);
    switch (typeStr) {
      case '1':
      case 'FixedPayment':
        return 'ثابت';
      case '2':
      case 'Installment':
        return 'قسط';
      case '3':
      case 'DebtPayment':
        return 'دين';
      case '4':
      case 'SafityPayment':
        return 'توفير';
      default:
        return 'ثابت';
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
