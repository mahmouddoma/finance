import { Component, inject, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AccountService } from '../../../../Core/Services/Account/account.service';
import { AccountStore } from '../../../../Core/Services/account-store/account.store';

@Component({
  selector: 'app-setup-basic-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup-basic-info.html',
  styleUrl: './setup-basic-info.css',
})
export class SetupBasicInfo implements OnInit {
  readonly langService = inject(LanguageService);
  private accountService = inject(AccountService);
  private accountStore = inject(AccountStore);
  private cdr = inject(ChangeDetectorRef);
  @Output() close = new EventEmitter<void>();

  fields: {
    key: string;
    labelEn: string;
    labelAr: string;
    value: number | string;
  }[] = [
    { key: 'bankBalance', labelEn: 'Bank Balance', labelAr: 'رصيد البنك', value: '' },
    {
      key: 'monthlyCashBalance',
      labelEn: 'Monthly Cash Balance',
      labelAr: 'رصيد النقد الشهري',
      value: '',
    },
    { key: 'netWealth', labelEn: 'Net Wealth', labelAr: 'صافي الثروة', value: '' },
    {
      key: 'totalObligationsAmount',
      labelEn: 'Total Obligations Amount',
      labelAr: 'إجمالي مبلغ الالتزامات',
      value: '',
    },
  ];

  loading = false;
  errorMessage = '';

  ngOnInit() {
    this.loading = true;
    console.log('Fetching account user data...');
    this.accountService.getAccountUser().subscribe({
      next: (data) => {
        console.log('Account User Data Received:', data);
        this.loading = false;
        if (data) {
          this.fields.forEach((field) => {
            const key = field.key as keyof typeof data;
            // Check if property exists in data
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              const val = data[key];
              console.log(`Setting ${key} to ${val}`);
              // If value is 0 or null/undefined, keep it empty so user doesn't have to delete '0'
              field.value = val === 0 || val === null || val === undefined ? '' : (val as number);
            }
          });
          this.cdr.detectChanges(); // Force view update
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to pre-fill settings', err);
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const payload = {
      bankBalance: Number(this.fields.find((f) => f.key === 'bankBalance')?.value || 0),
      monthlyCashBalance: Number(
        this.fields.find((f) => f.key === 'monthlyCashBalance')?.value || 0,
      ),
      netWealth: Number(this.fields.find((f) => f.key === 'netWealth')?.value || 0),
      totalObligationsAmount: Number(
        this.fields.find((f) => f.key === 'totalObligationsAmount')?.value || 0,
      ),
    };

    this.accountService.setBasicInfo(payload).subscribe({
      next: () => {
        this.loading = false;
        // Reload account data to update the dashboard reactively
        this.accountStore.loadAccount().subscribe();
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
