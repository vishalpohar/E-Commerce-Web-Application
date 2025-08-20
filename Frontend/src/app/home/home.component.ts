import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/Users/user.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Product,
  ProductServiceService,
} from '../services/Products/product-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  electronicsProducts: Product[] = [];
  fashionProducts: Product[] = [];
  accessoriesProducts: Product[] = [];
  wearablesProducts: Product[] = [];

  banners = [
    { imgUrl: 'banners/New Fashion.png' },
    { imgUrl: 'banners/Electronic Sale.png' },
    { imgUrl: 'banners/New Arrivals.png' },
    { imgUrl: 'banners/Big Deals.png' },
  ];

  user: any = null;
  loggedIn: boolean = false;

  // Use an array to hold all subscription
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    public userService: UserService,
    private productService: ProductServiceService
  ) {}

  ngOnInit(): void {
    // 1. Fetch all products
    const productSub = this.productService
      .getAllProducts()
      .subscribe((data) => {
        this.products = data;

        // 2. Filter the fetched data into categories
        // (You can customize this logic based on your product properties)
        this.fashionProducts = this.products
          .filter((p) => p.category === 'Fashion')
          .slice(0, 6);
        this.electronicsProducts = this.products
          .filter((p) => p.category === 'Electronics')
          .slice(0, 6);
        this.accessoriesProducts = this.products
          .filter((p) => p.category === 'Accessories')
          .slice(0, 6);
        this.wearablesProducts = this.products
          .filter((p) => p.category === 'Wearables')
          .slice(0, 6);
      });

    // 3. Subscribe to user state
    const userSub = this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loggedIn = !!user;
        console.log('User state changed');
      }
    });

    // 4. Add all subscriptions to the array for proper cleanup
    this.subscriptions.push(productSub, userSub);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  viewProduct(id: any) {
    this.router.navigate(['/product', id]);
  }
}
