import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../services/Users/user.service';
import { Subject, takeUntil } from 'rxjs';
import { Address, AddressService } from '../services/address/address.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationServiceService } from '../services/notificationServices/notification-service.service';
import { AuthService } from '../services/authentication/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  editingUser = false;
  editingAddress = false;
  isLoading = false;
  user: any = {
    id: 0,
    userName: '',
    email: '',
  };
  userAddress: Address = {
    userId: 0,
    fullName: '',
    phone: '',
    state: '',
    district: '',
    city: '',
    pinCode: '',
    addressLine: '',
  };

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService,
    private addressService: AddressService,
    private authService: AuthService,
    private notificationService: NotificationServiceService
  ) {}

  ngOnInit() {
    this.userService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
      error: () => console.log('No user found!'),
    });

    this.addressService
      .getAddress(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (address) => {
          if (address) this.userAddress = address;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToOrders() {
    this.router.navigate(['/myorders', this.user.id]);
  }
  goToWishlist() {
    this.router.navigate(['/wishlist', this.user.id]);
  }

  updateAddress(form: any) {
    if (!form.valid) {
      this.notificationService.showError(
        'Please fill all the required fields!'
      );
    } else {
      this.editingAddress = false;
      this.isLoading = true;
      this.addressService
        .updateAddress(this.userAddress)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            setTimeout(() => {
              this.isLoading = false;
              this.notificationService.showSuccess(res.message);
            }, 2000);
          },
          error: (err) => {
            setTimeout(() => {
              this.isLoading = false;
              this.notificationService.showError(err.error?.message);
            }, 4000);
          },
        });
    }
  }

  newUserName(userForm: any) {
    if (!userForm.valid) {
      this.notificationService.showError(
        'Please fill all the required fields!'
      );
    } else {
      this.editingUser = false;
      this.isLoading = true;
      this.authService
        .updateUser(this.user)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            setTimeout(() => {
              this.isLoading = false;
              this.userService.setUser(this.user);
              this.notificationService.showSuccess(res.message);
            }, 2000);
          },
          error: (err) => {
            setTimeout(() => {
              this.isLoading = false;
              this.notificationService.showError(err.error?.message);
            }, 4000);
          },
        });
    }
  }
}
