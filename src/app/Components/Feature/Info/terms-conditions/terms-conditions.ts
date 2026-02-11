import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-conditions.html',
  styleUrl: './terms-conditions.css',
})
export class TermsConditionsComponent {
  readonly langService = inject(LanguageService);

  readonly content = computed(() => {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'الشروط والأحكام' : 'Terms & Conditions',
      intro: isAr
        ? 'تنظم هذه الشروط استخدامك لخدمة فلوسي.'
        : 'These terms regulate your use of Felosy service.',
      sections: [
        {
          title: isAr ? 'الحساب والمسؤولية' : 'Account & Responsibility',
          text: isAr
            ? 'أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور الخاصة بك.'
            : 'You are responsible for maintaining the confidentiality of your account information and password.',
        },
        {
          title: isAr ? 'استخدام الخدمة' : 'Usage of Service',
          text: isAr
            ? 'يجب استخدام فلوسي فقط للأغراض القانونية. نحن نسعى دائماً لتوفير خدمة مستقرة ودقيقة.'
            : 'Felosy must be used only for legal purposes. We always strive to provide a stable and accurate service.',
        },
      ],
    };
  });
}
