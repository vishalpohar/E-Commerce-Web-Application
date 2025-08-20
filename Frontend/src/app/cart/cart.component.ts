import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartsService } from '../services/Carts/carts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../services/orders/orders.service';
import { Address, AddressService } from '../services/address/address.service';
import { AddressComponent } from '../address/address.component';
import { Subject, takeUntil } from 'rxjs';
import { NotificationServiceService } from '../services/notificationServices/notification-service.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, AddressComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  userAddress: Address = {
    id: 0,
    userId: 0,
    fullName: '',
    phone: '',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    addressLine: '',
  };

  userId: number | null = null;
  products: any[] = [];
  paymentMode: string = 'cod'; // Default payment mode
  showCheckout: boolean = false;
  isLoading: boolean = true;
  totalAmount: number = 0;
  showOptions = false;
  isPlacingOrder = false;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartsService,
    private ordersService: OrdersService,
    private addressService: AddressService,
    private notificationService: NotificationServiceService
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Get userId from route and fetch the cart
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.cartService.fetchCart(this.userId);
        this.addressService.getAddress(this.userId).subscribe({
          next: (response) => {
            this.userAddress = response;
            console.log(this.userAddress);
          },
          error: (err) => console.error('Failed to load address', err),
        });
      } else {
        console.log('User ID is missing, unable to fetch cart.');
      }
    });

    // Reactively update when address changes
    this.addressService.address$.subscribe((address) => {
      if (address) this.userAddress = address;
    });

    // Subscribe to the cart service to get cart items
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
      // When items are fetched, set the initial quantity for each to 1
      this.products = items.map((item) => ({
        ...item,
        quantity: 1,
      }));
      this.calculateTotal(); // Calculate initial total
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(item: any): void {
    // Enforce quantity limits (min 1, max available stock)
    if (item.quantity < 1) {
      item.quantity = 1;
    } else if (item.quantity > item.productStock) {
      item.quantity = item.productStock;
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.products.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  }

  removeItem(productId: number): void {
    if (this.userId) {
      this.cartService.deleteCartItem(this.userId, productId).subscribe({
        next: () =>
          this.notificationService.showSuccess('Item removed successfully'),
        error: (err) => {
          console.log(err.error?.message);
          this.notificationService.showError('Failed to remove item');
        },
      });
    }
  }

  toggleCheckout(): void {
    this.showCheckout = !this.showCheckout;
  }

  @ViewChild('AddressComponent') addressComponent!: AddressComponent;

  formMode: string = '';
  existingAddress: Address = {
    id: 0,
    userId: 0,
    fullName: '',
    phone: '',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    addressLine: '',
  };

  editAddress() {
    this.formMode = 'edit';
    if (this.userAddress) this.existingAddress = this.userAddress;
    this.addressComponent.openModal();
    this.showOptions = !this.showOptions;
  }

  addAddress() {
    this.formMode = 'add';
    this.addressComponent.openModal();
  }

  removeAddress(userId: any) {
    this.addressService.deleteAddress(Number(userId));
    this.showOptions = !this.showOptions;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  placeOrder() {
    if (this.userId && this.products.length > 0 && this.userAddress.id) {
      const orderdetails: any = {
        userId: this.userId,
        addressId: this.userAddress.id,
        paymentMethod: this.paymentMode,
        items: this.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      };
      this.isPlacingOrder = true;
      this.ordersService.postOrder(orderdetails).subscribe({
        next: () => {
          this.notificationService.showSuccess('Order placed successfully');
          setTimeout(() => {
            this.cartService.clearCart(this.userId!).subscribe();
          }, 3000);
        },
        error: (err) => {
          console.error('Failed to place order:', err);
          this.notificationService.showError(
            'There was an error placing your order, Please try again.'
          );
        },
      });
    }
  }
}
