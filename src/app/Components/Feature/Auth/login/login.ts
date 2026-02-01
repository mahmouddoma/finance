import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth/auth.service';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { LoginRequest } from '../../../../Core/Models/Auth/auth.models';
import { AuthHeader } from '../../../shared/auth-header/auth-header';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthHeader],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly langService = inject(LanguageService);

  model: LoginRequest = {
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.model).subscribe({
      next: (response) => {
        this.loading = false;
        if (!response.isVerified) {
          this.router.navigate(['/verify-email']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message ||
          (this.langService.isAr()
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'Invalid email or password');
      },
    });
  }

  getContent() {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'مرحباً بك مجدداً' : 'Welcome Back',
      subtitle: isAr ? 'سجل دخولك لمتابعة إدارة أموالك' : 'Login to continue managing your money',
      emailLabel: isAr ? 'البريد الإلكتروني' : 'Email Address',
      passwordLabel: isAr ? 'كلمة المرور' : 'Password',
      submitBtn: isAr ? 'تسجيل الدخول' : 'Login',
      noAccount: isAr ? 'ليس لديك حساب؟' : "Don't have an account?",
      registerLink: isAr ? 'إنشاء حساب' : 'Create Account',
    };
  }

  getMarketingContent() {
    const isAr = this.langService.isAr();
    return {
      hero: isAr
        ? 'FinanceManagement بيحوّل مرتبك من “أرقام على ورق” إلى نظام تشغيل شهري'
        : 'FinanceManagement turns your salary from "numbers on paper" into a monthly operating system',
      subHero: isAr
        ? 'لوحة شهرية، ميزانيات أسبوعية، وتتبع مصروفات — عشان تتحكم في فلوسك قبل ما الشهر يخلص.'
        : 'Monthly dashboard, weekly budgets, and expense tracking — so you control your money before the month ends.',
      cta: isAr
        ? 'ابدأ الشهر بخطة... وكمّل بتنفيذ.'
        : 'Start the month with a plan... and finish with execution.',
      benefits: [
        {
          title: isAr ? 'سيطرة حقيقية على الشهر' : 'Real control over the month',
          desc: isAr
            ? 'مش هتسأل “المرتب راح فين؟” تاني...'
            : "You won't ask 'Where did the salary go?' again...",
          icon: 'bi-check-circle-fill',
        },
        {
          title: isAr ? 'تنفيذ تلقائي بدل تذكير يدوي' : 'Automated execution',
          desc: isAr
            ? 'الالتزامات بتتحول لتذاكر دفع تلقائياً.'
            : 'Obligations automatically turn into payment tickets.',
          icon: 'bi-lightning-fill',
        },
        {
          title: isAr ? 'نظام أسبوعي يحميك من الصرف الزائد' : 'Weekly caps protect you',
          desc: isAr
            ? 'تحكم في مصروفاتك الأسبوعية لتجنب انتهاء المرتب مبكراً.'
            : 'Control weekly expenses to avoid running out of money early.',
          icon: 'bi-shield-check',
        },
        {
          title: isAr ? 'تاريخ مالي كامل' : 'Full financial history',
          desc: isAr
            ? 'كل حركة مسجلة عشان تفهم نمط صرفك وتصلح أخطائك.'
            : 'Every movement is recorded to understand your spending patterns.',
          icon: 'bi-clock-history',
        },
      ],
      whyDifferent: {
        title: isAr ? 'لماذا نحن مختلفون؟' : 'Why are we different?',
        desc: isAr
          ? 'معظم التطبيقات بتخليك تدخل أرقام... إحنا بنقدملك نظام تنفيذ وإدارة حقيقي.'
          : 'Most apps just let you enter numbers... we provide a real execution and management system.',
      },
    };
  }
}
