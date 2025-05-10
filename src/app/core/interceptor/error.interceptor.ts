import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {ErrorHandlerService} from '../services/error-handler.service';
import {catchError, throwError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError(error => {
      errorService.handleError(error);

      if (error.error && error.error.errorCode) {
        errorService.handleBusinessError(error.error.errorCode);
      }

      return throwError(() => error);
    })
  );
};
