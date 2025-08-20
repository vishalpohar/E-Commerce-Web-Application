import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  private apiUrl = 'https://localhost:7224/api/carts';

  private cartSubject = new BehaviorSubject<any[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
  fetchCart(userId: number) {
    this.getCart(userId).subscribe((data) => {
      this.cartSubject.next(data);
    });
  }

  addToCart(userId: number, productId: number): Observable<any> {
    const body = { userId, productId };
    return this.http
      .post(`${this.apiUrl}`, body)
      .pipe(tap(() => this.fetchCart(userId)));
  }

  deleteCartItem(userId: number, productId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}?userId=${userId}&productId=${productId}`)
      .pipe(tap(() => this.fetchCart(userId)));
  }

  clearCart(userId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/clearcart/${userId}`)
      .pipe(tap(() => this.cartSubject.next([])));
  }
}
