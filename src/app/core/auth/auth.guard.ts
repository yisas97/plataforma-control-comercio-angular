import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  console.log("Token en el guard:", token);
  if (token) {
    if (authService.isTokenValid()) {
      return true;
    }
  }

  // Si no hay token o es inválido, redirigir al login
  router.navigate(['/auth/login']);
  return false;
};
