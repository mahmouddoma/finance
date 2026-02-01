import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountService } from '../../../../Core/Services/Account/account.service';

@Component({
  selector: 'app-setup-basic-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup-basic-info.html',
  styleUrl: './setup-basic-info.css',
})
export class SetupBasicInfo {
  readonly langService = inject(LanguageService);
  private accountService = inject(AccountService);
  @Output() close = new EventEmitter<void>();

  fields = [
    { key: 'bankBalance', labelEn: 'Bank Balance', labelAr: 'رصيد البنك', value: 0 },
    {
      key: 'monthlyCashBalance',
      labelEn: 'Monthly Cash Balance',
      labelAr: 'رصيد النقد الشهري',
      value: 0,
    },
    { key: 'netWealth', labelEn: 'Net Wealth', labelAr: 'صافي الثروة', value: 0 },
    {
      key: 'totalObligationsAmount',
      labelEn: 'Total Obligations Amount',
      labelAr: 'إجمالي مبلغ الالتزامات',
      value: 0,
    },
  ];

  loading = false;
  errorMessage = '';

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const payload = {
      bankBalance: this.fields.find((f) => f.key === 'bankBalance')?.value || 0,
      monthlyCashBalance: this.fields.find((f) => f.key === 'monthlyCashBalance')?.value || 0,
      netWealth: this.fields.find((f) => f.key === 'netWealth')?.value || 0,
      totalObligationsAmount:
        this.fields.find((f) => f.key === 'totalObligationsAmount')?.value || 0,
    };

    this.accountService.setBasicInfo(payload).subscribe({
      next: () => {
        this.loading = false;
        this.close.emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message ||
          (this.langService.isAr() ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving data');
      },
    });
  }

  getContent() {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'إعداد الحساب' : 'Account Setup',
      subtitle: isAr
        ? 'قم بتحديث معلوماتك المالية الأساسية للحفاظ على دقة لوحة التحكم الخاصة بك.'
        : 'Update your basic financial information to keep your dashboard accurate.',
      submit: isAr ? 'تحديث المعلومات' : 'Update Information',
    };
  }
}
