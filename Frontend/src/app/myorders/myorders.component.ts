import { Component } from '@angular/core';
import {
  OrderApiResponse,
  OrdersService,
} from '../services/orders/orders.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IstDatePipe } from '../pipes/ist-date.pipe';

@Component({
  selector: 'app-myorders',
  imports: [CommonModule, IstDatePipe],
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css',
})
export class MyordersComponent {
  userId: number | null = null;
  baseUrl = 'https://localhost:7224/';

  ordersResponse$: Observable<OrderApiResponse | null>;

  // State for pagination
  currentPage = 1;
  pageSize = 5; // Let's show 5 orders per page
  totalOrders = 0;

  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.ordersResponse$ = this.ordersService.Orders$;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = Number(params.get('userId'));
      if (this.userId) {
        this.fetchOrdersForPage();
      }
    });

    this.ordersResponse$.subscribe((response) => {
      if (response) {
        this.totalOrders = response.totalOrders;
      }
    });
  }

  fetchOrdersForPage(): void {
    if (this.userId) {
      this.ordersService.fetchOrders(
        this.userId,
        this.currentPage,
        this.pageSize
      );
    }
  }

  viewProduct(id: number) {
    this.router.navigate(['/product', id]);
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchOrdersForPage();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchOrdersForPage();
    }
  }

  getArrivalDate(orderPlaced: string): Date {
    const placedDate = new Date(orderPlaced);
    placedDate.setDate(placedDate.getDate() + 4); // Add 4 days
    return placedDate;
  }
}
