import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../Services/Toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error) {
        // Handle the specific backend format provided:
        // { errors: [{ message: "..." }], detail: "..." }
        if (
          error.error.errors &&
          Array.isArray(error.error.errors) &&
          error.error.errors.length > 0
        ) {
          errorMessage = error.error.errors[0].message;
        } else if (error.error.detail) {
          errorMessage = error.error.detail;
        } else if (error.error.title) {
          errorMessage = error.error.title;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }

      // Show toast if it's not a 401 (Auth is handled separately or we can show it too)
      // The user wants 404 (Not Found) with specific detail message handled.
      toastService.error(errorMessage);

      return throwError(() => error);
    }),
  );
};
