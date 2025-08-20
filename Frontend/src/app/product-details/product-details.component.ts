import { Component, inject, OnInit } from '@angular/core';
import {
  Product,
  ProductServiceService,
} from '../services/Products/product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/Users/user.service';
import { WishlistService } from '../services/wishlists/wishlist.service';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { CartsService } from '../services/Carts/carts.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationServiceService } from '../services/notificationServices/notification-service.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  user: any = null;
  product: Product | undefined;
  relatedProducts: Product[] = [];
  isWishlisted = false;
  isInCart = false;
  products$: Observable<any[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private productService: ProductServiceService,
    private wishlistService: WishlistService,
    private cartService: CartsService,
    private toastr: ToastrService,
    private notificationService: NotificationServiceService
  ) {
    this.products$ = this.wishlistService.wishlist$;
  }

  http = inject(HttpClient);

  ngOnInit(): void {
    const productId$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id')))
    );

    productId$
      .pipe(
        switchMap((productId) =>
          this.productService.getAllProducts().pipe(
            map((products) => {
              this.product = products.find((p) => p.id === productId);
              this.relatedProducts = products.filter(
                (p) =>
                  p.category === this.product?.category &&
                  p.id !== this.product?.id
              );
              return productId;
            })
          )
        ),
        switchMap((productId) =>
          this.userService.user$.pipe(
            filter((user) => !!user?.id),
            tap((user) => (this.user = user)),
            switchMap((user) =>
              combineLatest([
                this.wishlistService.getWishlist(user.id),
                this.cartService.getCart(user.id),
              ]).pipe(
                tap(([wishlist, cart]) => {
                  this.isWishlisted = wishlist.some(
                    (w) => w.productId === productId
                  );
                  this.isInCart = cart.some((c) => c.productId === productId);
                })
              )
            )
          )
        )
      )
      .subscribe();
  }

  viewProduct(id: any) {
    this.router.navigate(['/product', id]);
  }

  toggleWishlist(productId: any) {
    if (!this.user) {
      this.router.navigateByUrl('/login');
      return;
    }

    const previousWishState = this.isWishlisted;
    this.isWishlisted = !this.isWishlisted;

    const action$ = this.isWishlisted
      ? this.wishlistService.addToWishlist(this.user.id, productId)
      : this.wishlistService.deleteFromWishlist(this.user.id, productId);

    action$.subscribe({
      next: () => {
        const message = this.isWishlisted
          ? 'Added to Wishlist'
          : 'Removed from Wislist';
        this.notificationService.showSuccess(message);
      },
      error: (err) => {
        console.error(err);
        this.isWishlisted = previousWishState;
        this.notificationService.showError('Action failed!');
      },
    });
  }

  addToCart(productId: any) {
    if (!this.user) {
      this.router.navigateByUrl('/login');
      return;
    } else {
      this.isInCart = !this.isInCart;

      if (this.isInCart) {
        this.cartService.addToCart(this.user.id, productId).subscribe({
          next: () => this.notificationService.showSuccess('Added to Cart'),
          error: (err) => {
            console.error('Add to cart failed:', err, err.error?.message);
            this.notificationService.showError('Failed to add to cart');
          },
        });
      }
    }
  }

  openCart() {
    this.router.navigate(['/cart', this.user.id]);
  }

  orderProcess(productId: any) {
    if (!this.user) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.router.navigate(['/preorder', productId, this.user.id]);
  }
}
