import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = 'https://localhost:7224/api/wishlists';

  private wishlistSubject = new BehaviorSubject<any[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWishlist(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  fetchWishlist(userId: number) {
    this.getWishlist(userId).subscribe((data) => {
      this.wishlistSubject.next(data);
    });
  }

  addToWishlist(userId: number, productId: number) {
    const body = { userId, productId };
    return this.http
      .post(`${this.apiUrl}`, body)
      .pipe(tap(() => this.fetchWishlist(userId)));
  }

  deleteFromWishlist(userId: number, productId: number) {
    return this.http
      .delete(`${this.apiUrl}?userId=${userId}&productId=${productId}`)
      .pipe(tap(() => this.fetchWishlist(userId)));
  }
}
