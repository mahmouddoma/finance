import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../../Core/Services/Account/account.service';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { RegisterRequest } from '../../../../Core/Models/Auth/auth.models';
import { AuthHeader } from '../../../shared/auth-header/auth-header';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthHeader],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  readonly langService = inject(LanguageService);

  model: RegisterRequest = {
    email: '',
    password: '',
    phoneNumber: '',
  };

  loading = false;
  errorMessage = '';

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || (this.langService.isAr() ? 'حدث خطأ ما' : 'Something went wrong');
      },
    });
  }

  getContent() {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'إنشاء حساب جديد' : 'Create New Account',
      subtitle: isAr
        ? 'انضم إلى فلوسي وابدأ في إدارة أموالك بذكاء'
        : 'Join Felosy and start managing your money smartly',
      emailLabel: isAr ? 'البريد الإلكتروني' : 'Email Address',
      passwordLabel: isAr ? 'كلمة المرور' : 'Password',
      phoneLabel: isAr ? 'رقم الهاتف' : 'Phone Number',
      submitBtn: isAr ? 'إنشاء الحساب' : 'Create Account',
      haveAccount: isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?',
      loginLink: isAr ? 'تسجيل الدخول' : 'Login',
    };
  }

  getMarketingContent() {
    const isAr = this.langService.isAr();
    return {
      hero: isAr
        ? 'ابدأ الشهر بخطة... وكمّل بتنفيذ.'
        : 'Start the month with a plan... and finish with execution.',
      subHero: isAr
        ? 'FinanceManagement بيوفرلك الأدوات اللي محتاجها عشان تدير كل مليم في مرتبك بذكاء.'
        : 'FinanceManagement provides the tools you need to manage every penny of your salary smartly.',
      benefits: [
        {
          title: isAr ? 'رؤية واضحة لميزانيتك' : 'Clear budget visibility',
          desc: isAr
            ? 'Dashboard بيوضحلك المتبقي والمدفوع والالتزامات.'
            : 'Dashboard shows remaining, paid, and obligations.',
          icon: 'bi-bar-chart-fill',
        },
        {
          title: isAr ? 'إدارة التزامات مرنة' : 'Flexible obligation management',
          desc: isAr
            ? 'نظام تذاكر (Tickets) لكل التزام مالي.'
            : 'Ticketing system for every financial obligation.',
          icon: 'bi-tags-fill',
        },
      ],
    };
  }
}
