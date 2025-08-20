import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface singleProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private apiUrl = 'https://localhost:7224/api/products';
  public imageBaseUrl = 'https://localhost:7224/';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products) =>
        products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          imageUrl: this.imageBaseUrl + product.imageUrl,
          category: product.category,
          stock: product.stock,
        }))
      )
    );
  }

  getProduct(productid: number): Observable<singleProduct> {
    return this.http.get<singleProduct>(`${this.apiUrl}/${productid}`).pipe(
      map((product) => ({
        ...product,
        imageUrl: this.imageBaseUrl + product.imageUrl,
      }))
    );
  }

  searchProducts(keywords: string, loadClick: number, loadSize: number) {
    return this.http.get<any>(`${this.apiUrl}/search`, {params: {
      keywords: keywords,
      loadClick: loadClick,
      loadSize: loadSize,
    },
  }).pipe(
    map((res: { products: Product[]; totalCount: number; hasMore: boolean }) => ({
      products: res.products.map((product: Product) => ({
        ...product,
        imageUrl: this.imageBaseUrl + product.imageUrl,
      })),
      totalCount: res.totalCount,
      hasMore: res.hasMore,
    }))
  )
  }
}
