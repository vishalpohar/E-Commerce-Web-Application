import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface OrderApiResponse {
  totalOrders: number;
  pageNumber: number;
  pageSize: number;
  data: any[];
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = 'https://localhost:7224/api/orders';

  private OrdersResponseSubject = new BehaviorSubject<OrderApiResponse | null>(
    null
  );
  public Orders$ = this.OrdersResponseSubject.asObservable();

  constructor(private http: HttpClient) {}

  getOrders(
    userId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get(`${this.apiUrl}/${userId}`, { params: params });
  }

  fetchOrders(userId: number, pageNumber: number, pageSize: number): void {
    this.getOrders(userId, pageNumber, pageSize).subscribe({
      next: (response: OrderApiResponse) => {
        this.OrdersResponseSubject.next(response);
      },
      error: (err) => {
        console.log(err.error?.message);
      },
    });
  }

  postOrder(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, body).pipe(
      tap(() => {
        this.fetchOrders(body.userId, 1, 5);
      })
    );
  }
}
