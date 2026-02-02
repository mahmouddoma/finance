import { Component, inject, signal, effect, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { BoardService } from '../../../../Core/Services/Board/board.service';

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
  private boardService = inject(BoardService);

  currentYear = signal(2026);
  selectedMonth = signal(1); // 0-indexed for MonthsAr/En? (0=Jan, 1=Feb)

  constructor() {
    // Automatically fetch board when year or month changes
    effect(() => {
      const year = this.currentYear();
      const month = this.selectedMonth() + 1; // API usually expects 1-12
      this.boardService.getBoard(year, month).subscribe();
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
  }
}
