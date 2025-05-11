import { Routes } from '@angular/router';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';
import {authGuard} from './core/auth/auth.guard';
import {adminGuard} from './core/auth/admin.guard';
import {producerGuard} from './core/auth/producer.guard';
import {ErrorLayoutComponent} from './layouts/error-layout/error-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/admin/components/inicio/inicio.component')
          .then(c => c.InicioComponent),
        canActivate: [authGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/product-routes').then(r => r.PRODUCT_ROUTES),
        canActivate: [authGuard]
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/orders/components/cart/cart.component')
          .then(c => c.CartComponent),
        canActivate: [authGuard]
      },
      {
        path: 'checkout',
        loadComponent: () => import('./features/orders/components/checkout/checkout.component')
          .then(c => c.CheckoutComponent),
        canActivate: [authGuard]
      },
      {
        path: 'pedidos',
        loadChildren: () => import('./features/orders/order-routes').then(r => r.ORDER_ROUTES),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./features/auth/auth-routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    loadChildren: () => import('./features/admin/admin-route').then(r => r.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'producer',
    component: MainLayoutComponent,
    loadChildren: () => import('./features/producer/producer-routes').then(r => r.PRODUCER_ROUTES),
    canActivate: [authGuard, producerGuard]
  },
  {
    path: 'marketplace',
    component: MainLayoutComponent,
    loadChildren: () => import('./features/marketplace/marketplace-routes').then(r => r.MARKETPLACE_ROUTE),
  },
  {
    path: 'error/:code',
    component: ErrorLayoutComponent
  },
  {
    path: '404',
    component: ErrorLayoutComponent
  },
  {
    path: '500',
    component: ErrorLayoutComponent,
    data: {
      error: '500'
    }
  },
  { path: '**', redirectTo: '/404' }
];
