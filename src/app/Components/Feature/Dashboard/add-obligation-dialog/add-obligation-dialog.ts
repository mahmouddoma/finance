import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { ObligationService } from '../../../../Core/Services/Obligation/obligation.service';
import { CreateObligationRequest } from '../../../../Core/Models/Obligation/obligation.models';

@Component({
  selector: 'app-add-obligation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-obligation-dialog.html',
  styleUrl: './add-obligation-dialog.css',
})
export class AddObligationDialog {
  readonly langService = inject(LanguageService);
  private obligationService = inject(ObligationService);

  @Output() close = new EventEmitter<void>();

  selectedType = signal<'Fixed' | 'Installment' | 'Debt'>('Fixed');
  loading = false;
  errorMessage = '';

  fields: CreateObligationRequest = {
    title: '',
    amount: 0,
    dueDate: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  };

  getContent() {
    const isAr = this.langService.isAr();
    const type = this.selectedType();

    return {
      title: isAr ? 'إضافة التزام جديد' : 'Add New Obligation',
      subtitle: isAr
        ? 'قم بإنشاء التزام مالي جديد. اختر النوع واملأ التفاصيل.'
        : 'Create a new financial obligation. Choose the type and fill in the details.',
      types: [
        { key: 'Fixed', label: isAr ? 'ثابت' : 'Fixed' },
        { key: 'Installment', label: isAr ? 'قسط' : 'Installment' },
        { key: 'Debt', label: isAr ? 'دين' : 'Debt' },
      ],
      labels: {
        title: isAr ? 'العنوان' : 'Title',
        amount: isAr ? 'المبلغ' : 'Amount',
        dueDay: isAr ? 'يوم الاستحقاق (1-31)' : 'Due Day (1-31)',
        startDate: isAr ? 'تاريخ البدء' : 'Start Date',
        endDate: isAr ? 'تاريخ الانتهاء' : 'End Date',
        save: isAr ? `حفظ ${this.getTypeLabel(type, isAr)}` : `Save ${type} Payment`,
      },
    };
  }

  private getTypeLabel(type: string, isAr: boolean) {
    if (!isAr) return type;
    switch (type) {
      case 'Fixed':
        return 'التزام ثابت';
      case 'Installment':
        return 'قسط';
      case 'Debt':
        return 'دين';
      default:
        return type;
    }
  }

  setType(type: any) {
    this.selectedType.set(type);
  }

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    const request = {
      ...this.fields,
      startDate: new Date(this.fields.startDate).toISOString(),
      endDate: new Date(this.fields.endDate).toISOString(),
    };

    let obs;
    switch (this.selectedType()) {
      case 'Fixed':
        obs = this.obligationService.createFixedPayment(request);
        break;
      case 'Installment':
        obs = this.obligationService.createInstallment(request);
        break;
      case 'Debt':
        obs = this.obligationService.createDebtPayment(request);
        break;
    }

    if (obs) {
      obs.subscribe({
        next: () => {
          this.loading = false;
          this.close.emit();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err.error?.message || (this.langService.isAr() ? 'حدث خطأ ما' : 'Something went wrong');
        },
      });
    }
  }
}
