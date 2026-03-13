import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.toastService.success('Successfully logged in');
      }),
      catchError(err => {
        this.toastService.error(err.error?.message || 'Invalid credentials');
        throw err;
      })
    );
  }

  register(email: string, password: string, firstName: string, lastName: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, { email, password, firstName, lastName }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.toastService.success('Account created successfully');
      }),
      catchError(err => {
        this.toastService.error(err.error?.message || 'Registration failed');
        throw err;
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
