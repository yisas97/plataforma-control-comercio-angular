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
  },
  {
    path: 'purchase-history',
    loadComponent: () => import('./components/purchase-history/purchase-history.component')
      .then(c => c.PurchaseHistoryComponent)
  },
  {
    path: 'recommendations',
    loadComponent: () => import('./components/recommendations/recommendations.component')
      .then(c => c.RecommendationsComponent)
  }
];
