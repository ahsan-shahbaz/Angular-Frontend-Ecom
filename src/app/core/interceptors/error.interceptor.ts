import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  
  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error', error);
      toastService.error(error.message || 'An unexpected error occurred');
      return throwError(() => error);
    })
  );
};
