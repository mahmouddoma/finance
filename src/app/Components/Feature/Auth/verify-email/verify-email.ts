import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth/auth.service';
import { LanguageService } from '../../../../Core/Services/Language/language.service';
import { AuthHeader } from '../../../shared/auth-header/auth-header';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthHeader],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly langService = inject(LanguageService);

  otpCode = '';
  loading = false;
  resending = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    // Automatically send OTP when component loads
    this.resendOTP();
  }

  onVerify() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.verifyOTP(this.otpCode).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message ||
          (this.langService.isAr() ? 'رمز التحقق غير صحيح' : 'Invalid verification code');
      },
    });
  }

  resendOTP() {
    this.resending = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.requestOTP().subscribe({
      next: () => {
        this.resending = false;
        this.successMessage = this.langService.isAr()
          ? 'تم إعادة إرسال الرمز بنجاح'
          : 'Verification code resent successfully';
      },
      error: (err) => {
        this.resending = false;
        this.errorMessage =
          err.error?.message ||
          (this.langService.isAr() ? 'فشل إعادة إرسال الرمز' : 'Failed to resend code');
      },
    });
  }

  getContent() {
    const isAr = this.langService.isAr();
    return {
      title: isAr ? 'تحقق من بريدك الإلكتروني' : 'Verify Your Email',
      subtitle: isAr
        ? 'لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني'
        : 'We have sent a verification code to your email',
      otpLabel: isAr ? 'رمز التحقق (OTP)' : 'Verification Code (OTP)',
      submitBtn: isAr ? 'تحقق الآن' : 'Verify Now',
      resendBtn: isAr ? 'إعادة إرسال الرمز' : 'Resend Code',
      backToLogin: isAr ? 'العودة لتسجيل الدخول' : 'Back to Login',
    };
  }
}
