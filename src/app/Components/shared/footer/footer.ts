import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../Core/Services/Language/language.service';

type Social = {
  icon: string;
  label: string;
  href: string;
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly langService = inject(LanguageService);

  readonly socials = computed<Social[]>(() => [
    { icon: 'facebook', label: 'Facebook', href: '#' },
    { icon: 'twitter-x', label: 'X', href: '#' },
    { icon: 'instagram', label: 'Instagram', href: '#' },
  ]);

  readonly content = computed(() => {
    const isAr = this.langService.isAr();
    return {
      brand: isAr ? 'فلوسي' : 'Felosy',
      tagline: isAr
        ? 'شريكك المالي الذكي لإدارة مصاريفك وتحويلاتك بكل سهولة.'
        : 'Your smart financial partner to manage expenses and transfers with ease.',
      quickLinks: isAr ? 'روابط سريعة' : 'Quick Links',
      about: isAr ? 'عن فلوسي' : 'About Felosy',
      features: isAr ? 'المميزات' : 'Features',
      contactLink: isAr ? 'اتصل بنا' : 'Contact Us',
      privacy: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
      terms: isAr ? 'الشروط والأحكام' : 'Terms & Conditions',
      contact: isAr ? 'تواصل معنا' : 'Contact',
      copyright: isAr ? '© 2026 فلوسي. جميع الحقوق محفوظة.' : '© 2026 Felosy. All rights reserved.',
      email: 'support@felosy.com',
      phone: '+20 123 456 7890',
      builtBy: isAr ? 'صُمم وطُور بواسطة' : 'Built By',
      louayDesc: isAr
        ? 'بناء أنظمة خلفية قابلة للتطوير ونظيفة وسهلة الصيانة مع التركيز على البنية والأداء.'
        : 'Building scalable, clean, and maintainable backend systems with focus on architecture.',
      mahmoudDesc: isAr
        ? 'متخصص في Angular وJavaScript وHTML وCSS والتصميم المتجاوب.'
        : 'Proficient in Angular, JavaScript, HTML, CSS & Responsive Design.',
    };
  });
}
