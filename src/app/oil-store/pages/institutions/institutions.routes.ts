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
