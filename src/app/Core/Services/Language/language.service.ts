import { Injectable, signal, effect } from '@angular/core';

export type Lang = 'ar' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  readonly currentLang = signal<Lang>('ar');

  constructor() {
    // Initial side effect to set document attributes
    effect(() => {
      const lang = this.currentLang();
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });

    // Try to load from localStorage if available
    const saved = localStorage.getItem('felosy_lang') as Lang;
    if (saved && (saved === 'ar' || saved === 'en')) {
      this.currentLang.set(saved);
    }
  }

  setLanguage(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem('felosy_lang', lang);
  }

  toggleLanguage() {
    this.setLanguage(this.currentLang() === 'ar' ? 'en' : 'ar');
  }

  isAr() {
    return this.currentLang() === 'ar';
  }
}
