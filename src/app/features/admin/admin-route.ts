export  const ADMIN_ROUTES = [
  {
    path: 'home',
    loadComponent: () => import('./components/inicio/inicio.component')
      .then(c => c.InicioComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(c => c.DashboardComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/category-management/category-management.component')
      .then(c => c.CategoryManagementComponent)
  }
];
