import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://localhost:7224/api/values';
  private apiurl = 'https://localhost:7224/api/otp';

  private authSubject = new BehaviorSubject<[]>([]);
  auth$ = this.authSubject.asObservable();

  registerUser(body: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}`, body);
  }

  verifyNewUser(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/newUser`, body);
  }

  updateUser(body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, body);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(
      `${this.apiurl}/send`,
      { email: email },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  verifyOtp(body: any): Observable<any> {
    return this.http.post(`${this.apiurl}/verify`, body);
  }
}
