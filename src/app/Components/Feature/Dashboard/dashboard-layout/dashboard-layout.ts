import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { SummaryCards } from '../summary-cards/summary-cards';
import { ObligationList } from '../obligation-list/obligation-list';
import { AddObligationDialog } from '../add-obligation-dialog/add-obligation-dialog';
import { SetupBasicInfo } from '../setup-basic-info/setup-basic-info';
import { CommonModule } from '@angular/common';
import { TimelineSidebar } from '../timeline-sidebar/timeline-sidebar';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { BoardService } from '../../../../Core/Services/Board/board.service';
import { HeaderComponent } from '../../../shared/header/header';
import { FooterComponent } from '../../../shared/footer/footer';
import { WalletGrid } from '../wallet-grid/wallet-grid';
import { AccountService } from '../../../../Core/Services/Account/account.service';
import { ListObligationInstanceDto, WalletDto } from '../../../../Core/Services/Board/board.models';
import { ObligationView, AccountUserResponse } from '../../../../Core/Models/User/user.models';

import { Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    SummaryCards,
    ObligationList,
    AddObligationDialog,
    SetupBasicInfo,
    TimelineSidebar,
    HeaderComponent,
    WalletGrid,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {
  readonly langService = inject(LanguageService);
  protected boardService = inject(BoardService);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private router = inject(Router);

  showAddDialog = signal(false);
  showSetupDialog = signal(false);
  isSidebarOpen = signal(true);
  protected accountData = signal<AccountUserResponse | null>(null);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.accountService.getAccountUser().subscribe({
      next: (data) => this.accountData.set(data),
      error: (err) => console.error('Failed to fetch account data', err),
    });
  }

  protected get isFutureDate(): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const filter = this.boardService.lastFilter;

    if (filter.year > currentYear) return true;
    if (filter.year === currentYear && filter.month > currentMonth) return true;

    return false;
  }

  createBoard() {
    const board = this.boardService.currentBoard();

    const filter = (this.boardService as any).lastFilter || { year: 2026, month: 2 };

    this.boardService.createBoard(filter.year, filter.month).subscribe();
  }

  protected wallets = computed(() => {
    const board = this.boardService.currentBoard();
    const accountUser = this.accountData();

    const uniqueWallets = new Map<string, WalletDto>();

    // Extract from board instances
    board?.obligationInstances?.forEach((inst: ListObligationInstanceDto) => {
      if (inst.wallet) uniqueWallets.set(inst.wallet.id, inst.wallet);
    });

    // Extract from tickets
    board?.tickets?.forEach((ticket) => {
      if (ticket.wallet) uniqueWallets.set(ticket.wallet.id, ticket.wallet);
    });

    // Extract from account user obligations
    accountUser?.listObligation?.forEach((obl: ObligationView) => {
      if (obl.wallet) uniqueWallets.set(obl.wallet.id, obl.wallet as any);
    });

    return Array.from(uniqueWallets.values());
  });

  getContent() {
    const isAr = this.langService.isAr();
    const filter = this.boardService.lastFilter;

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

    const monthName = isAr ? monthsAr[filter.month - 1] : monthsEn[filter.month - 1];

    return {
      welcome: isAr ? 'أهلاً بك مجدداً' : 'Welcome back',
      subtitle: isAr
        ? `إليك ما يحدث في أمورك المالية في ${monthName} ${filter.year}.`
        : `Here's what's happening with your finances in ${monthName} ${filter.year}.`,
      overview: isAr ? 'نظرة عامة مالية' : 'Financial Overview',
      addBtn: isAr ? 'إضافة التزام' : 'Add Obligation',
      obligations: isAr ? 'الالتزامات' : 'Obligations',
    };
  }
}
