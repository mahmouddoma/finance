import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { BoardStore } from '../../../../Core/Services/board-store/board.store';
import {
  GetBoardDetailsResponse,
  CancelTicketRequest,
  WalletPaidSummaryDto,
} from '../../../../Core/Models/Board/board.models';
import { BoardService } from '../../../../Core/Services/Board/board.service';
import { AddTicketDialog } from '../add-ticket-dialog/add-ticket-dialog';
import { PaymentDialog } from '../payment-dialog/payment-dialog';
import { TimelineSidebar } from '../timeline-sidebar/timeline-sidebar';
import { HeaderComponent } from '../../../shared/header/header';

@Component({
  selector: 'app-monthly-dashboard',
  standalone: true,
  imports: [CommonModule, AddTicketDialog, PaymentDialog, TimelineSidebar, HeaderComponent],
  templateUrl: './monthly-dashboard.html',
  styleUrl: './monthly-dashboard.css',
})
export class MonthlyDashboard implements OnInit {
  readonly langService = inject(LanguageService);
  private readonly boardStore = inject(BoardStore);
  private readonly boardService = inject(BoardService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  year = signal<number>(0);
  month = signal<number>(0);
  boardData = signal<GetBoardDetailsResponse | null>(null);
  loading = signal(false);
  showAddTicketDialog = signal(false);
  showPayDialog = signal(false);
  selectedItem = signal<{ item: any; type: 'ticket' | 'obligation' } | null>(null);
  isSidebarOpen = signal(false); // Default to false for mobile-first, or check window

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    if (window.innerWidth < 992) {
      this.isSidebarOpen.set(false);
    } else {
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  readonly SAFETY_WALLET_ID = 'b2b8a18f-46cf-4a73-9b46-5bb586b49fe2';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const year = +params['year'];
      const month = +params['month'];
      this.year.set(year);
      this.month.set(month);
      this.loadBoard(year, month);
    });
  }

  loadBoard(year: number, month: number) {
    this.loading.set(true);
    this.boardStore.loadBoard(year, month).subscribe({
      next: (data: GetBoardDetailsResponse | null) => {
        this.boardData.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getMonthName() {
    const monthsAr = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];
    const monthsEn = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const isAr = this.langService.isAr();
    return isAr ? monthsAr[this.month() - 1] : monthsEn[this.month() - 1];
  }

  getStatusLabel(status: any): { labelEn: string; labelAr: string; color: string } {
    const statusStr = String(status);
    switch (statusStr) {
      case 'Done':
      case '2':
        return { labelEn: 'Done', labelAr: 'مكتمل', color: 'success' };
      case 'Open':
      case '1':
        return { labelEn: 'Open', labelAr: 'مفتوح', color: 'primary' };
      case 'Overdue':
      case '4':
        return { labelEn: 'Overdue', labelAr: 'متأخر', color: 'danger' };
      case 'Cancelled':
      case '3':
        return { labelEn: 'Cancelled', labelAr: 'ملغي', color: 'secondary' };
      default:
        return { labelEn: statusStr, labelAr: statusStr, color: 'secondary' };
    }
  }

  getTypeLabel(type: any): { labelEn: string; labelAr: string } {
    const typeStr = String(type);
    switch (typeStr) {
      case 'FixedPayment':
      case '1':
        return { labelEn: 'Fixed', labelAr: 'ثابت' };
      case 'Installment':
      case '2':
        return { labelEn: 'Installment', labelAr: 'قسط' };
      case 'DebtPayment':
      case '3':
        return { labelEn: 'Debt', labelAr: 'دين' };
      case 'SafityPayment':
      case '4':
        return { labelEn: 'Savings', labelAr: 'توفير' };
      default:
        return { labelEn: typeStr, labelAr: typeStr };
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getObligationsByStatus(status: string) {
    const data = this.boardData();
    if (!data || !data.obligationInstances) return [];
    return data.obligationInstances.filter(
      (obligation) => String(obligation.status) === status || obligation.status === status,
    );
  }

  getTicketsByStatus(status: string, numStatus?: string) {
    const data = this.boardData();
    if (!data || !data.tickets) return [];
    return data.tickets.filter(
      (ticket) =>
        String(ticket.status) === status ||
        ticket.status === status ||
        (numStatus && (String(ticket.status) === numStatus || ticket.status === numStatus)),
    );
  }

  getUniqueWeeks(status: string, numStatus?: string): number[] {
    const tickets = this.getTicketsByStatus(status, numStatus);
    const weeks = [...new Set(tickets.map((t) => t.weekNumber || 1))];
    return weeks.sort((a, b) => a - b);
  }

  getTicketsByStatusAndWeek(status: string, numStatus: string | undefined, week: number) {
    return this.getTicketsByStatus(status, numStatus).filter((t) => (t.weekNumber || 1) === week);
  }

  hasStatus(status: string): boolean {
    return (
      this.getObligationsByStatus(status).length > 0 || this.getTicketsByStatus(status).length > 0
    );
  }

  hasObligations(status: string): boolean {
    return this.getObligationsByStatus(status).length > 0;
  }

  hasTickets(status: string, numStatus?: string): boolean {
    return this.getTicketsByStatus(status, numStatus).length > 0;
  }

  getStatusSections() {
    return [
      { key: 'Done', labelEn: 'Completed', labelAr: 'مكتمل', color: 'success', numKey: '2' },
      { key: 'Open', labelEn: 'Open', labelAr: 'مفتوح', color: 'primary', numKey: '1' },
      { key: 'Overdue', labelEn: 'Overdue', labelAr: 'متأخر', color: 'danger', numKey: '4' },
      { key: 'Cancelled', labelEn: 'Cancelled', labelAr: 'ملغي', color: 'secondary', numKey: '3' },
    ];
  }

  isSafetyWallet(walletId: string): boolean {
    return walletId === this.SAFETY_WALLET_ID;
  }

  isIncomeWallet(walletCode: string): boolean {
    return walletCode === 'Income';
  }

  canPay(status: string | number): boolean {
    const s = String(status);
    return s !== 'Done' && s !== '2' && s !== 'Cancelled' && s !== '3';
  }

  openPayDialog(item: any, type: 'ticket' | 'obligation') {
    this.selectedItem.set({ item, type });
    this.showPayDialog.set(true);
  }

  createBoard() {
    this.loading.set(true);
    this.boardStore.createBoardForLastFilter().subscribe({
      next: () => {
        this.loadBoard(this.year(), this.month());
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  cancelTicket(ticket: any) {
    if (
      !confirm(
        this.langService.isAr()
          ? 'هل أنت متأكد من إلغاء هذه التذكرة؟'
          : 'Are you sure you want to cancel this ticket?',
      )
    ) {
      return;
    }

    this.loading.set(true);
    const request: CancelTicketRequest = {
      boardId: this.boardData()!.boardId,
      ticketId: ticket.id,
      occurredOn: new Date().toISOString().split('T')[0],
    };

    this.boardService.cancelTicket(request).subscribe({
      next: () => {
        this.loadBoard(this.year(), this.month());
      },
      error: (err) => {
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
