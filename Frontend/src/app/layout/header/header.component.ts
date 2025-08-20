import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/Users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user: any = null;
  loggedIn: boolean = false;
  searchValue: any = '';
  showDropdown = false;
  isClickMode = false;
  private userSubscription: Subscription | undefined;
  private hideTimer: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.loggedIn = !!user;
      console.log(this.user);
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  // Hover show
  showMenu() {
    if (!this.isClickMode) {
      clearTimeout(this.hideTimer);
      this.showDropdown = true;
    }
  }

  // Hover hide
  startHideTimer() {
    if (!this.isClickMode) {
      this.hideTimer = setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    }
  }

  // Cancels the timer if the user moves their mouse over the menu
  cancelHideTimer() {
    clearTimeout(this.hideTimer);
  }

  // Toggle click mode
  toggleDropdown() {
    this.isClickMode = !this.isClickMode;
    this.showDropdown = this.isClickMode ? true : false;
  }

  // Delete click outside when in click mode
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isClickMode && !this.eRef.nativeElement.contains(event.target)) {
      this.isClickMode = false;
      this.showDropdown = false;
    }
  }

  onSearch(keywords: string) {
    if (keywords && keywords.trim()) {
      this.router.navigate(['/search', keywords.trim()]);
      console.log(keywords);
    } else {
      this.router.navigateByUrl('home');
    }
  }

  closeDropdown() {
    this.isClickMode = false;
    this.showDropdown = false;
  }

  openProfile(userId: number) {
    this.router.navigate(['/userProfile', userId]);
    this.closeDropdown();
  }

  openWishlist(userId: number) {
    this.router.navigate(['/wishlist', userId]);
    this.closeDropdown();
  }

  openCart() {
    if (!this.loggedIn) {
      this.router.navigateByUrl('login');
      return;
    }
    this.router.navigate(['/cart', this.user.id]);
  }

  openMyOrders(userId: any) {
    this.router.navigate(['/myorders', userId]);
    this.closeDropdown();
  }

  logout() {
    this.userService.logout();
    this.closeDropdown();
    this.router.navigateByUrl('home');
  }
}
