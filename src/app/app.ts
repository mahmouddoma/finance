import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/shared/header/header';
import { FooterComponent } from './Components/shared/footer/footer';
import { LanguageService } from './Core/Services/Language/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly langService = inject(LanguageService);
  currentLang = this.langService.currentLang;
}
