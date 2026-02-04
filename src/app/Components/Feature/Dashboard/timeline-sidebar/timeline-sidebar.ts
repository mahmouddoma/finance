import { Component, inject, signal, effect, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { BoardStore } from '../../../../Core/Services/board-store/board.store';

@Component({
  selector: 'app-timeline-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-sidebar.html',
  styleUrl: './timeline-sidebar.css',
})
export class TimelineSidebar {
  @Input() isOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();
  readonly langService = inject(LanguageService);
  private boardService = inject(BoardStore);
  private router = inject(Router);

  currentYear = signal(2026);
  selectedMonth = signal(1);

  constructor() {
    effect(() => {
      const year = this.currentYear();
      const month = this.selectedMonth() + 1;
      this.boardService.loadBoard(year, month).subscribe();
    });
  }

  monthsAr = [
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

  monthsEn = [
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

  getContent() {
    const isAr = this.langService.isAr();
    return {
      langLabel: isAr ? 'اللغة' : 'Language',
      yearLabel: isAr ? 'السنة' : 'Year',
      monthLabel: isAr ? 'الشهر' : 'Month',
      months: isAr ? this.monthsAr : this.monthsEn,
    };
  }

  changeYear(delta: number) {
    this.currentYear.update((y) => y + delta);
  }

  selectMonth(index: number) {
    this.selectedMonth.set(index);
    // Navigate to monthly dashboard
    const year = this.currentYear();
    const month = index + 1;
    this.router.navigate(['/dashboard', year, month]);
  }
}
