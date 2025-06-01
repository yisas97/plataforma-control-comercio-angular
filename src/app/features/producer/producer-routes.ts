export  const PRODUCER_ROUTES = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/producer-dashboard/producer-dashboard.component')
      .then(c => c.ProducerDashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/producer-products/producer-products.component')
      .then(c => c.ProducerProductsComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/producer-orders/producer-orders.component')
      .then(c => c.ProducerOrdersComponent)
  }
];
