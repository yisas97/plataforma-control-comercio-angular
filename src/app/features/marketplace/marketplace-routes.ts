export  const MARKETPLACE_ROUTE = [
  {
    path: '',
    loadComponent: () => import('./components/marketplace/marketplace.component')
      .then(c => c.MarketplaceComponent)
  }
];
