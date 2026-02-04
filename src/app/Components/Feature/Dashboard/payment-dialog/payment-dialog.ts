import { Component, inject, Output, EventEmitter, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { BoardService } from '../../../../Core/Services/Board/board.service';
import {
  PayTicketRequest,
  PayObligationRequest,
  TransferSafityRequest,
} from '../../../../Core/Models/Board/board.models';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-dialog.html',
  styleUrl: './payment-dialog.css',
})
export class PaymentDialog implements OnInit {
  readonly langService = inject(LanguageService);
  private boardService = inject(BoardService);

  @Input() boardId!: string;
  @Input() data!: { item: any; type: 'ticket' | 'obligation' };
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  loading = false;
  errorMessage = '';
  readonly SAFETY_WALLET_ID = 'b2b8a18f-46cf-4a73-9b46-5bb586b49fe2';

  fields = {
    amount: 0,
    occurredOn: new Date().toISOString().split('T')[0],
  };

  ngOnInit() {
    if (this.data?.item) {
      this.fields.amount = this.data.item.amount || 0;
    }
  }

  isSafety() {
    return this.data?.item?.wallet?.id === this.SAFETY_WALLET_ID;
  }

  getContent() {
    const isAr = this.langService.isAr();
    const isTransfer = this.isSafety();

    return {
      title: isTransfer
        ? isAr
          ? 'تحويل لمحفظة الأمان'
          : 'Transfer to Safety Wallet'
        : (isAr ? 'تسديد' : 'Pay') +
          ' ' +
          (this.data.type === 'ticket'
            ? isAr
              ? 'تذكرة'
              : 'Ticket'
            : isAr
              ? 'التزام'
              : 'Obligation'),
      subtitle: isAr
        ? 'تأكيد تفاصيل الدفع وسجل المعاملة.'
        : 'Confirm payment details and transaction record.',
      labels: {
        amount: isAr ? 'المبلغ المدفوع' : 'Paid Amount',
        date: isAr ? 'تاريخ المعاملة' : 'Transaction Date',
        confirm: isTransfer
          ? isAr
            ? 'تحويل'
            : 'Transfer'
          : isAr
            ? 'تأكيد الدفع'
            : 'Confirm Payment',
        cancel: isAr ? 'إلغاء' : 'Cancel',
      },
    };
  }

  onSubmit() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    const isSafety = this.isSafety();
    const isTicket = this.data.type === 'ticket';

    if (isSafety) {
      const request: TransferSafityRequest = {
        boardId: this.boardId,
        obligationInstanceId: this.data.item.id,
        walletId: this.data.item.wallet.id,
        paidAmount: this.fields.amount,
        occurredOn: this.fields.occurredOn,
      };

      this.boardService.transferSafity(request).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
    } else if (isTicket) {
      const request: PayTicketRequest = {
        boardId: this.boardId,
        ticketId: this.data.item.id,
        walletId: this.data.item.wallet.id,
        paidAmount: this.fields.amount,
        occurredOn: this.fields.occurredOn,
      };
      this.boardService.paidTicket(request).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
    } else {
      const request: PayObligationRequest = {
        boardId: this.boardId,
        obligationInstanceId: this.data.item.id,
        walletId: this.data.item.wallet.id,
        paidAmount: this.fields.amount,
        occurredOn: this.fields.occurredOn,
      };
      this.boardService.payObligation(request).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      });
    }
  }

  private handleSuccess() {
    this.loading = false;
    this.success.emit();
    this.close.emit();
  }

  private handleError(err: any) {
    this.loading = false;
    this.errorMessage =
      err.error?.message || (this.langService.isAr() ? 'حدث خطأ ما' : 'Something went wrong');
  }
}
