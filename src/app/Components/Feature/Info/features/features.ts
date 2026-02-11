import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class FeaturesComponent {
  readonly langService = inject(LanguageService);

  readonly features = computed(() => {
    const isAr = this.langService.isAr();
    return [
      {
        icon: 'bi-wallet2',
        title: isAr ? 'إدارة المحافظ' : 'Wallet Management',
        desc: isAr
          ? 'نظم فلوسك في محافظ كاش أو بنك. تتبع الرصيد الحالي بدقة متناهية.'
          : 'Organize your money in cash or bank wallets. Track current balance with extreme precision.',
        color: '#38bdf8',
      },
      {
        icon: 'bi-calendar-check',
        title: isAr ? 'الالتزامات والاشتراكات' : 'Obligations & Subs',
        desc: isAr
          ? 'سجل ديونك، أقساطك، أو اشتراكاتك الشهرية. فلوسي هتفكرك بالمواعيد قبلها.'
          : 'Record your debts, installments, or monthly subscriptions. Felosy will remind you before deadlines.',
        color: '#00e676',
      },
      {
        icon: 'bi-gem',
        title: isAr ? 'قائمة الأمنيات' : 'Wish List',
        desc: isAr
          ? 'نفسك تجيب حاجة غالية؟ حطها في الأمنيات وشوف فاضلك كام عشان تحققها.'
          : 'Dreaming of something expensive? Put it in the wishlist and see how much is left to achieve it.',
        color: '#f59e0b',
      },
      {
        icon: 'bi-kanban',
        title: isAr ? 'اللوحات الشهرية' : 'Monthly Boards',
        desc: isAr
          ? 'كل شهر له لوحة مستقلة. وزع دخلك على التزاماتك واعرف هتصرف كام في اليوم.'
          : 'Every month has an independent board. Distribute your income over your obligations and know your daily spend limit.',
        color: '#ef4444',
      },
    ];
  });
}
