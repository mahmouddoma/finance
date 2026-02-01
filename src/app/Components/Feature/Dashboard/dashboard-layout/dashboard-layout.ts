import { Component, inject, signal } from '@angular/core';
import { SummaryCards } from '../summary-cards/summary-cards';
import { ObligationList } from '../obligation-list/obligation-list';
import { AddObligationDialog } from '../add-obligation-dialog/add-obligation-dialog';
import { SetupBasicInfo } from '../setup-basic-info/setup-basic-info';
import { CommonModule } from '@angular/common';
import { TimelineSidebar } from '../timeline-sidebar/timeline-sidebar';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { HeaderComponent } from '../../../shared/header/header';
import { FooterComponent } from '../../../shared/footer/footer';

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
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  readonly langService = inject(LanguageService);

  showAddDialog = signal(false);
  showSetupDialog = signal(false);

  getContent() {
    const isAr = this.langService.isAr();
    return {
      welcome: isAr ? 'أهلاً بك مجدداً' : 'Welcome back',
      subtitle: isAr
        ? 'إليك ما يحدث في أمورك المالية في فبراير 2026.'
        : "Here's what's happening with your finances in February 2026.",
      overview: isAr ? 'نظرة عامة مالية' : 'Financial Overview',
      addBtn: isAr ? 'إضافة التزام' : 'Add Obligation',
      obligations: isAr ? 'الالتزامات' : 'Obligations',
    };
  }
}
