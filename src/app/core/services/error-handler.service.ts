import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  handleError(error: HttpErrorResponse): void {
    console.error('Error HTTP:', error);

    if (error.status) {
      switch (error.status) {
        case 401:
          this.authService.logout();
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.router.url }
          });
          break;

        case 403:
          this.router.navigate(['/error/403']);
          break;

        case 404:
          this.router.navigate(['/404']);
          break;

        case 500:
        case 503:
          this.router.navigate(['/500']);
          break;

        default:
          this.router.navigate(['/error', error.status.toString()]);
          break;
      }
    } else {
      this.router.navigate(['/error/unknown']);
    }
  }

  handleBusinessError(errorCode: string): void {
    // Aquí puedes manejar errores específicos del backend
    console.warn('Error de negocio:', errorCode);
  }
}
