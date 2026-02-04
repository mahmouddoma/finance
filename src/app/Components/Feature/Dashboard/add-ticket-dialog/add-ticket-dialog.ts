import { Component, inject, Output, EventEmitter, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { BoardService } from '../../../../Core/Services/Board/board.service';
import { WalletService } from '../../../../Core/Services/Wallet/wallet.service';
import { AddTicketRequest, WalletMinimalDto } from '../../../../Core/Models/Board/board.models';

@Component({
  selector: 'app-add-ticket-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-ticket-dialog.html',
  styleUrl: './add-ticket-dialog.css',
})
export class AddTicketDialog implements OnInit {
  readonly langService = inject(LanguageService);
  private boardService = inject(BoardService);
  private walletService = inject(WalletService);

  @Input() boardId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  loading = false;
  errorMessage = '';
  wallets = signal<WalletMinimalDto[]>([]);

  fields: AddTicketRequest = {
    boardId: '',
    walletId: '',
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    amount: 0,
  };

  ngOnInit() {
    this.fields.boardId = this.boardId;
    this.loadWallets();
  }

  loadWallets() {
    this.walletService.getWallets().subscribe({
      next: (data) => this.wallets.set(data),
      error: () =>
        (this.errorMessage = this.langService.isAr()
          ? 'فشل تحميل المحافظ'
          : 'Failed to load wallets'),
    });
  }

  getContent() {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'إضافة تذكرة جديدة' : 'Add New Ticket',
      subtitle: isAr
        ? 'قم بإضافة تذكرة مصاريف جديدة لهذا الشهر.'
        : 'Add a new expense ticket for this month.',
      labels: {
        title: isAr ? 'العنوان' : 'Title',
        amount: isAr ? 'المبلغ' : 'Amount',
        dueDate: isAr ? 'تاريخ الاستحقاق' : 'Due Date',
        wallet: isAr ? 'المحفظة' : 'Wallet',
        save: isAr ? 'حفظ التذكرة' : 'Save Ticket',
        cancel: isAr ? 'إلغاء' : 'Cancel',
        selectWallet: isAr ? 'اختر المحفظة' : 'Select Wallet',
      },
    };
  }

  onSubmit() {
    if (this.loading || !this.fields.walletId) return;

    this.loading = true;
    this.errorMessage = '';

    this.boardService.addTicket(this.fields).subscribe({
      next: () => {
        this.loading = false;
        this.success.emit();
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
