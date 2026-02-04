import { Component, inject } from '@angular/core';
import { ToastService } from '../../../Core/Services/Toast/toast.service';

@Component({
  selector: 'app-toast-component',
  imports: [],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
})
export class ToastComponent {
  toastService = inject(ToastService);
}
