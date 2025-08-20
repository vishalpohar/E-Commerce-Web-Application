import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser() {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user');
  }

  logout() {
    sessionStorage.clear();
    this.userSubject.next(null);
  }
}
