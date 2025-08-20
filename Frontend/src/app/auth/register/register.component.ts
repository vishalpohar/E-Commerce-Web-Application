import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { NotificationServiceService } from '../../services/notificationServices/notification-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  confirmPassword: any = '';
  userDetails: any = {
    userName: '',
    email: '',
    otp: '',
  };
  isLoading = false;
  otpTime = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationServiceService
  ) {}

  onSubmit(form: any) {
    if (!form.valid) {
      return this.notificationService.showError(
        'Please fill all the required fields with valid data.'
      );
    } else if (!this.otpTime) {
      const details = {
        userName: this.userDetails.userName,
        email: this.userDetails.email,
      };
      this.authService.registerUser(details).subscribe({
        next: (res) => {
          this.otpTime = true;
          this.notificationService.showSuccess(res.message);
        },
        error: (err) => {
          this.notificationService.showError(err.error?.message);
          console.error(err);
        },
      });
    } else {
      this.isLoading = true;
      this.authService.verifyNewUser(this.userDetails).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.isLoading = false;
            form.resetForm();
            this.notificationService.showSuccess(res.message);
          }, 2000);

          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2500);
        },
        error: (err) => {
          setTimeout(() => {
            this.isLoading = false;
            this.notificationService.showError(err.error?.message);
            console.error(err);
          }, 4000);
        },
      });
    }
  }
}
