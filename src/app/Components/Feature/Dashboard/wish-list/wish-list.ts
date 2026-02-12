import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountStore } from '../../../../Core/Services/account-store/account.store';
import { AccountApiService } from '../../../../Core/Services/Account/account-api.service';
import { WishStatus, WishView } from '../../../../Core/Models/User/user.models';

import { AddWishDialog } from '../add-wish-dialog/add-wish-dialog';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, AddWishDialog],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {
  protected readonly WishStatus = WishStatus;
  protected readonly accountStore = inject(AccountStore);
  private readonly accountApi = inject(AccountApiService);

  readonly wishes = computed(() => {
    const account = this.accountStore.account();

    return account?.wishes || [];
  });

  readonly showAddDialog = signal(false);

  getWishStatus(wish: WishView): WishStatus {
    const status = wish.status as any;

    if (status === WishStatus.Done || status === 'Done' || status === 'Fulfilled') {
      return WishStatus.Done;
    }

    if (status === WishStatus.Cancelled || status === 'Cancelled') {
      return WishStatus.Cancelled;
    }

    if (wish.desiredOn && new Date(wish.desiredOn) < new Date()) {
      return WishStatus.Overdue;
    }

    if (status === 'New') return WishStatus.New;
    if (status === 'Available') return WishStatus.Available;
    if (status === 'Overdue') return WishStatus.Overdue;

    return status;
  }

  getStatusColor(statusOrPriority: string | WishStatus): string {
    // Handle Status Colors
    if (statusOrPriority === WishStatus.Done) return 'success';
    if (statusOrPriority === WishStatus.Overdue) return 'danger';
    if (statusOrPriority === WishStatus.Available || statusOrPriority === WishStatus.New)
      return 'primary';

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
