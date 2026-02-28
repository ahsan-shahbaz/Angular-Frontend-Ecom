import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private toastService: ToastService) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Mock user authentication
    const mockUser: User = {
      id: 1,
      email,
      firstName: 'John',
      lastName: 'Doe',
      token: 'mock-jwt-token-12345'
    };

    return of(mockUser).pipe(
      delay(800),
      map(user => {
        if (email === 'test@test.com' && password === 'password') {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.toastService.success('Successfully logged in');
          return user;
        }
        this.toastService.error('Invalid credentials');
        throw new Error('Invalid credentials');
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.toastService.show('Logged out successfully', 'info');
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token || null;
  }
}
