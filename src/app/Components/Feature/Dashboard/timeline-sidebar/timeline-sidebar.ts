import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';

@Component({
  selector: 'app-timeline-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-sidebar.html',
  styleUrl: './timeline-sidebar.css',
})
export class TimelineSidebar {
  readonly langService = inject(LanguageService);

  currentYear = signal(2026);
  selectedMonth = signal(1); // February (0-indexed or 1-indexed, let's use 0-11)

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
