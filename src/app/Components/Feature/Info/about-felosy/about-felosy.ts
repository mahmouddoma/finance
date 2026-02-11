import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-felosy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-felosy.html',
  styleUrl: './about-felosy.css',
})
export class AboutFelosyComponent {
  readonly langService = inject(LanguageService);

  readonly content = computed(() => {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'عن فلوسي' : 'About Felosy',
      subtitle: isAr ? 'رؤيتنا نحو حرية مالية حقيقية' : 'Our vision towards true financial freedom',
      storyTitle: isAr ? 'حكايتنا' : 'Our Story',
      storyText: isAr
        ? 'بدأت فلوسي كفكرة بسيطة: كيف يمكننا جعل إدارة المال الشخصي عملية ممتعة وسهلة بدلاً من أن تكون عبئاً؟ نحن نؤمن أن كل قرش له مكانه، وأن الوضوح المالي هو الخطوة الأولى لتحقيق الأهداف الكبيرة.'
        : 'Felosy started as a simple idea: how can we make personal money management an enjoyable and easy process instead of a burden? We believe every penny has its place, and financial clarity is the first step to achieving big goals.',
      missionTitle: isAr ? 'مهمتنا' : 'Our Mission',
      missionText: isAr
        ? 'تمكين الأفراد من السيطرة على حياتهم المالية من خلال أدوات ذكية، بسيطة، وتفاعلية تساعدهم على اتخاذ قرارات أفضل كل يوم.'
        : 'Empowering individuals to take control of their financial lives through smart, simple, and interactive tools that help them make better decisions every day.',
      cta: isAr ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now',
    };
  });
}
