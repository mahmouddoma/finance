import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/shared/footer/footer';
import { LanguageService } from './Core/Services/Language/language.service';
import { ToastComponent } from './Components/shared/toast-component/toast-component';
import { ToastService } from './Core/Services/Toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly langService = inject(LanguageService);
  readonly toastService = inject(ToastService);
  currentLang = this.langService.currentLang;
}
