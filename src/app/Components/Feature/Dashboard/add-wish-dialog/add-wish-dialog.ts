import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountApiService } from '../../../../Core/Services/Account/account-api.service';

@Component({
  selector: 'app-add-wish-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-wish-dialog.html',
  styleUrl: './add-wish-dialog.css',
})
export class AddWishDialog {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private readonly accountApi = inject(AccountApiService);

  name = signal('');
  targetAmount = signal<number>(0);
  priority = signal<'Low' | 'Medium' | 'High'>('Medium');
  desiredOn = signal<string>('');
  notes = signal('');

  isLoading = signal(false);

  save() {
    if (!this.name() || this.targetAmount() <= 0) return;

    this.isLoading.set(true);
    const command = {
      name: this.name(),
      targetAmount: this.targetAmount(),
      priority: this.priority(),
      desiredOn: this.desiredOn() || null,
      notes: this.notes() || null,
    };

    this.accountApi.createWish(command).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.saved.emit();
        this.close.emit();
      },
      error: () => {
        this.isLoading.set(false);
        // Handle error (toast or alert)
        alert('Failed to add wish');
      },
    });
  }
}
