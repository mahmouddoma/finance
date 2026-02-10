import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStore } from '../../../../Core/Services/account-store/account.store';
import { AccountApiService } from '../../../../Core/Services/Account/account-api.service';
import { WishView } from '../../../../Core/Models/User/user.models';
import { AddWishDialog } from '../add-wish-dialog/add-wish-dialog';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, AddWishDialog],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {
  protected readonly accountStore = inject(AccountStore);
  private readonly accountApi = inject(AccountApiService);

  readonly wishes = computed(() => {
    const account = this.accountStore.account();

    return account?.wishes || [];
  });

  readonly showAddDialog = signal(false);

  getWishStatus(wish: WishView): 'Available' | 'Done' | 'Overdue' {
    if (wish.status === 'Fulfilled') {
      return 'Done';
    }
    if (wish.desiredOn && new Date(wish.desiredOn) < new Date()) {
      return 'Overdue';
    }
    return 'Available';
  }

  getStatusColor(statusOrPriority: string): string {
    // Handle Status Colors
    if (statusOrPriority === 'Done') return 'success';
    if (statusOrPriority === 'Overdue') return 'danger';
    if (statusOrPriority === 'Available') return 'primary';

    // Handle Priority Colors
    switch (statusOrPriority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'secondary';
    }
  }

  openAddDialog() {
    this.showAddDialog.set(true);
  }

  markAsDone(wish: WishView) {
    if (confirm('Are you sure you want to mark this wish as done?')) {
      const command = {
        wishId: wish.id,
        paidAmount: wish.targetAmount,
        paidAtUtc: new Date().toISOString(),
      };
      this.accountApi.completeWish(command).subscribe(() => {
        this.accountStore.loadAccount().subscribe();
      });
    }
  }

  cancelWish(wish: WishView) {
    if (confirm('Are you sure you want to cancel this wish?')) {
      this.accountApi.cancelWish({ wishId: wish.id }).subscribe(() => {
        this.accountStore.loadAccount().subscribe();
      });
    }
  }
}
