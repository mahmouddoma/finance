import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../Core/Services/Language/language.service';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="auth-header d-flex justify-content-between align-items-center px-3 px-md-4 py-3">
      <div class="logo-area d-flex align-items-center">
        <img src="assets/images/logo.jpeg" alt="Felosy Logo" class="logo-img me-2" />
        <!-- <span class="logo-text fw-bold fs-4 text-white">Felosy</span> -->
      </div>
      <button
        class="btn btn-outline-light btn-sm rounded-pill px-3 py-1 fw-bold small"
        (click)="langService.toggleLanguage()"
      >
        <i class="bi bi-translate me-1"></i>
        {{ langService.isAr() ? 'English' : 'عربي' }}
      </button>
    </header>
  `,
  styles: [
    `
      .auth-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: transparent;
      }
      .logo-img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        object-fit: cover;
      }

      @media (max-width: 767.98px) {
        .auth-header {
          position: relative;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
        }
        .logo-img {
          height: 40px;
          width: 40px;
        }
      }
    `,
  ],
})
export class AuthHeader {
  readonly langService = inject(LanguageService);
}
