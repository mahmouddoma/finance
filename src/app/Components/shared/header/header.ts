import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../Core/Services/Language/language.service';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Core/Services/Auth/auth.service';

type NavItem = {
  key: 'home';
  href: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  readonly navItems = signal<NavItem[]>([{ key: 'home', href: '/dashboard' }]);

  readonly content = computed(() => {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'فلوسي' : 'Felosy',
      home: isAr ? 'الرئيسية' : 'Home',
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
    }
  }
  // LogOut
  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
