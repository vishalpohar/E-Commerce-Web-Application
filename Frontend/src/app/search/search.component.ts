import { Component, OnInit } from '@angular/core';
import {
  Product,
  ProductServiceService,
} from '../services/Products/product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  search: string = '';
  loadingMore = false;
  initialLoading = false;
  loadClick = 1;
  loadSize = 10;
  totalCount = 0;
  hasMore = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductServiceService
  ) {}
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.search = params.get('keywords') || '';
      this.fetchProducts(true);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchProducts(isInitialLoad = false) {
    if (this.loadingMore || this.initialLoading) return;

    if (isInitialLoad) {
      this.initialLoading = true;
    } else {
      this.loadingMore = true;
    }

    this.productService
      .searchProducts(this.search, this.loadClick, this.loadSize)
      .subscribe((res) => {
        setTimeout(
          () => {
            if (isInitialLoad) {
              this.products = res.products;
              this.initialLoading = false;
            } else {
              this.products = [...this.products, ...res.products];
              this.loadingMore = false;
            }

            this.totalCount = res.totalCount;
            this.hasMore = res.hasMore;
          },
          isInitialLoad ? 0 : 2000
        );
      });
  }

  loadMore() {
    if (this.hasMore) {
      this.loadClick++;
      this.fetchProducts();
    }
  }

  viewProduct(id: any) {
    this.router.navigate(['/product', id]);
  }
}
