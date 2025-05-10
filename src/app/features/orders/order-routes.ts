import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/order-list/order-list.component')
      .then(c => c.OrderListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/order-detail/order-detail.component')
      .then(c => c.OrderDetailComponent)
  },
  {
    path: 'confirmation/:id',
    loadComponent: () => import('./components/order-confirmation/order-confirmation.component')
      .then(c => c.OrderConfirmationComponent)
  }
];
