import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout.component')
      .then(c => c.CheckoutComponent)
  },
  {
    path: 'order',
    loadComponent: () => import('./components/order/order.component')
      .then(c => c.OrderComponent)
  },
  {
    path: 'order/:id',
    loadComponent: () => import('./components/order-detail/order-detail.component')
      .then(m => m.OrderDetailComponent)
  },
];
