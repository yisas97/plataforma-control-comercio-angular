export  const MARKETPLACE_ROUTE = [
  {
    path: '',
    loadComponent: () => import('./components/marketplace/marketplace.component')
      .then(c => c.MarketplaceComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component')
      .then(c => c.CartComponent)
  }
];
