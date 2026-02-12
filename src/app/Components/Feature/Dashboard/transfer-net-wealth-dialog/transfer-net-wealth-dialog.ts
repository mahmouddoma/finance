import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountApiService } from '../../../../Core/Services/Account/account-api.service';
import {
  TransferNetWealthCommand,
  TransferNetWealthType,
} from '../../../../Core/Models/User/user.models';

@Component({
  selector: 'app-transfer-net-wealth-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-net-wealth-dialog.html',
  styleUrl: './transfer-net-wealth-dialog.css',
})
export class TransferNetWealthDialog {
  readonly langService = inject(LanguageService);
  private readonly accountApi = inject(AccountApiService);

  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  loading = false;
  errorMessage = '';

  amount: number | null = null;
  type: TransferNetWealthType = TransferNetWealthType.BalanceBank;

  // For template usage
  readonly TransferType = TransferNetWealthType;

  getContent() {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'تحويل من صافي الثروة' : 'Transfer from Net Wealth',
      subtitle: isAr
        ? 'تحويل الأموال إلى رصيد البنك أو الالتزامات'
        : 'Transfer funds to Bank Balance or Obligations',
      labels: {
        amount: isAr ? 'المبلغ' : 'Amount',
        type: isAr ? 'نوع التحويل' : 'Transfer Type',
        balanceBank: isAr ? 'رصيد البنك' : 'Bank Balance',
        obligation: isAr ? 'الالتزامات' : 'Obligations',
        confirm: isAr ? 'تأكيد' : 'Confirm',
        cancel: isAr ? 'إلغاء' : 'Cancel',
      },
    };
  }

  onSubmit() {
    if (this.loading || !this.amount || this.amount <= 0) return;

    this.loading = true;
    this.errorMessage = '';

    const command: TransferNetWealthCommand = {
      type: Number(this.type),
      amountPaid: this.amount,
    };

    this.accountApi
      .transferNetWealth(command)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.success.emit();
          this.close.emit();
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || (this.langService.isAr() ? 'حدث خطأ ما' : 'Something went wrong');
        },
      });
  }
}
