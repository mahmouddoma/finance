import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicyComponent {
  readonly langService = inject(LanguageService);

  readonly content = computed(() => {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
      lastUpdate: isAr ? 'آخر تحديث: فبراير 2026' : 'Last Updated: February 2026',
      intro: isAr
        ? 'خصوصيتك هي أولويتنا القصوى في فلوسي. نحن ندرك حساسية البيانات المالية.'
        : 'Your privacy is our top priority at Felosy. We understand the sensitivity of financial data.',
      sections: [
        {
          title: isAr ? 'جمع البيانات' : 'Data Collection',
          text: isAr
            ? 'نحن نجمع فقط البيانات التي تدخلها بنفسك (المحافظ، الالتزامات، التذاكر) لتزويدك بالخدمة.'
            : 'We only collect data that you enter yourself (wallets, obligations, tickets) to provide you with the service.',
        },
        {
          title: isAr ? 'حماية البيانات' : 'Data Protection',
          text: isAr
            ? 'يتم تشفير جميع البيانات وتخزينها بشكل آمن. نحن لا نشارك بياناتك مع أي طرف ثالث.'
            : 'All data is encrypted and stored securely. We do not share your data with any third party.',
        },
      ],
    };
  });
}
