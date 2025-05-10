export  const PRODUCT_ROUTES = [
  {
    path: '',
    loadComponent: () => import('./components/product-list/product-list.component')
      .then(c => c.ProductListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/product-detail/product-detail.component')
      .then(c => c.ProductDetailComponent)
  }
];
