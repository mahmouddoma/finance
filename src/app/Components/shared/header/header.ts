import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../Core/Services/Language/language.service';

type NavItem = {
  key: 'home' | 'transactions' | 'reports';
  href: string;
};

import { Router } from '@angular/router';
import { AuthService } from '../../../Core/Services/Auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  readonly langService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly lang = this.langService.currentLang;

  // Mobile menu state (no bootstrap JS)
  readonly mobileOpen = signal(false);

  readonly navItems = signal<NavItem[]>([
    { key: 'home', href: '#' },
    { key: 'transactions', href: '#transactions' },
    { key: 'reports', href: '#reports' },
  ]);

  readonly content = computed(() => {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'فلوسي' : 'Felosy',
      home: isAr ? 'الرئيسية' : 'Home',
      transactions: isAr ? 'التحويلات' : 'Transactions',
      reports: isAr ? 'التقارير' : 'Reports',
      logout: isAr ? 'تسجيل الخروج' : 'Logout',
      langBtn: isAr ? 'English' : 'عربي',
      menu: isAr ? 'القائمة' : 'Menu',
      close: isAr ? 'إغلاق' : 'Close',
    };
  });

  toggleLang(): void {
    this.langService.toggleLanguage();
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  labelFor(key: NavItem['key']): string {
    const c = this.content();
    switch (key) {
      case 'home':
        return c.home;
      case 'transactions':
        return c.transactions;
      case 'reports':
        return c.reports;
    }
  }
  // LogOut
  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
