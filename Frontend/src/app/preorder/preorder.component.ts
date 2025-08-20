import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Product,
  ProductServiceService,
  singleProduct,
} from '../services/Products/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Address, AddressService } from '../services/address/address.service';
import { AddressComponent } from '../address/address.component';
import { OrdersService } from '../services/orders/orders.service';
import { NotificationServiceService } from '../services/notificationServices/notification-service.service';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-preorder',
  imports: [CommonModule, FormsModule, AddressComponent],
  templateUrl: './preorder.component.html',
  styleUrl: './preorder.component.css',
})
export class PreorderComponent {
  productId: number = 0;
  userId: number = 0;
  product: singleProduct = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
  };
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
  paymentMode = '';

  showOptions = false;
  isPlacingOrder = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private addressService: AddressService,
    private ordersService: OrdersService,
    private notificationService: NotificationServiceService
  ) {}

  ngOnInit() {
    const routeParams$ = this.route.paramMap.pipe(
      map((params) => ({
        productId: Number(params.get('productId')),
        userId: Number(params.get('userId')),
      }))
    );

    routeParams$
      .pipe(
        switchMap(({ productId, userId }) => {
          this.productId = productId;
          this.userId = userId;

          return this.productService.getProduct(productId).pipe(
            tap((Product) => (this.product = Product)),
            switchMap(() => this.addressService.getAddress(userId)),
            tap((address) => (this.userAddress = address))
          );
        })
      )
      .subscribe({
        error: (err) =>
          console.error('failed to load product or address!', err),
      });

    // Reactively update when address changes
    this.addressService.address$.subscribe((address) => {
      if (address) this.userAddress = address;
    });
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
    if (
      this.userId != null &&
      this.productId != null &&
      this.userAddress.id != null
    ) {
      const orderdetails: any = {
        userId: this.userId,
        addressId: this.userAddress.id,
        paymentMethod: this.paymentMode,
        items: [
          {
            productId: this.productId,
            quantity: 1,
          },
        ],
      };
      this.isPlacingOrder = true;
      this.ordersService.postOrder(orderdetails).subscribe({
        next: () => {
          this.notificationService.showSuccess('Order Placed Successfully.');
          setTimeout(() => {
            this.isPlacingOrder = false;
            this.router.navigate(['/product', this.productId]);
          }, 2000);
        },
        error: (err) => {
          console.error('Unable to place order:', err, err.error?.message);
          this.notificationService.showError('Failed to place order!');
          this.isPlacingOrder = false;
        },
      });
    }
  }
}
