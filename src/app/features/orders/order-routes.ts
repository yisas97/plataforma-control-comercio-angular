import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout.component')
      .then(c => c.CheckoutComponent)
  }
];
