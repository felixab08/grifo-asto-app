import { Routes } from '@angular/router';

export const InstitutionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./institutions'),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./instituciones-list/instituciones-list'),
      },
      {
        path: 'ordenes-compra',
        loadComponent: () => import('./tipoVenta/tipoVenta'),
      },
      {
        path: 'ventas-institution',
        loadComponent: () => import('./ventas-institution/ventas-institution'),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
