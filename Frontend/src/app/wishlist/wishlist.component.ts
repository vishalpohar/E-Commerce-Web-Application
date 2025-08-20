import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WishlistService } from '../services/wishlists/wishlist.service';
import { Observable } from 'rxjs';
import { NotificationServiceService } from '../services/notificationServices/notification-service.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent {
  userId: any | null = null;
  products$: Observable<any[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private notificationService: NotificationServiceService
  ) {
    this.products$ = this.wishlistService.wishlist$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = Number(idParam);
        this.wishlistService.fetchWishlist(this.userId);
      }
    });
  }

  removeFromWishlist(productId: number): void {
    if (this.userId != null) {
      this.wishlistService
        .deleteFromWishlist(this.userId, productId)
        .subscribe({
          next: () =>
            this.notificationService.showSuccess('Removed successfully'),
          error: () => this.notificationService.showError('Failed to remove!'),
        });
    }
  }

  viewProduct(id: any) {
    this.router.navigate(['/product', id]);
  }
}
