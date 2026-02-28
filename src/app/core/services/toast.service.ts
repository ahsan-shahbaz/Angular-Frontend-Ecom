import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastSubject.next({ message, type });
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }
}
