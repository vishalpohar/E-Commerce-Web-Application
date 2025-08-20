import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Address {
  id?: number;
  userId: number;
  fullName: string;
  phone: string;
  pinCode: string;
  state: string;
  district: string;
  city: string;
  addressLine: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  addressSubject = new BehaviorSubject<Address | null>(null);
  address$ = this.addressSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAddress(userId: number): Observable<Address> {
    return this.http.get<Address>(
      `https://localhost:7224/api/addresses/${userId}`
    );
  }

  fetchAddress(userId: number): void {
    this.getAddress(userId).subscribe((data) => {
      this.addressSubject.next(data);
    });
  }

  saveAddress(body: any): void {
    if (body != null) {
      this.http.post('https://localhost:7224/api/addresses', body).subscribe({
        next: (res) => {
          console.log('Address saved successfully.', res);

          this.fetchAddress(body.userId);
        },
        error: (err) => {
          console.error('Error saving address.\n', err.error?.message);
        },
      });
    }
  }

  updateAddress(body: any): Observable<any> {
    return this.http
      .put(`https://localhost:7224/api/addresses/${body.userId}`, body)
      .pipe(tap(() => this.fetchAddress(body.userId)));
  }

  deleteAddress(userId: any) {
    if (userId != null) {
      this.http
        .delete(`https://localhost:7224/api/addresses/${userId}`)
        .subscribe({
          next: (res) => {
            console.log(res);

            this.fetchAddress(userId);
          },
          error: (err) => {
            console.log(err.error?.message);
          },
        });
    }
  }
}
