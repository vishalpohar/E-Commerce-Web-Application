import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/Users/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authentication/auth.service';
import { NotificationServiceService } from '../../services/notificationServices/notification-service.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginDetails = {
    email: '',
    otp: '',
  };

  otpTime = false;

  isLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationServiceService
  ) {}

  loginVerify(form: any) {
    if (!this.otpTime) {
      // Step 1: Send OTP
      this.authService.sendOtp(this.loginDetails.email).subscribe({
        next: (res) => {
          this.otpTime = true; // show OTP field
          this.notificationService.showSuccess(res.message);
        },
        error: (err) => this.notificationService.showError(err.error?.message),
      });
    } else {
      this.isLoading = true;
      // Step 2: Verify OTP
      this.authService.verifyOtp(this.loginDetails).subscribe({
        next: (res) => {
          this.userService.setUser(res.user);
          form.resetForm();
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigateByUrl('home');
          }, 2000);
        },
        error: (err) => {
          setTimeout(() => {
            this.isLoading = false;
            this.notificationService.showError(err.error?.message);
            console.log(err.error?.message);
          }, 4000);
        },
      });
    }
  }
}
