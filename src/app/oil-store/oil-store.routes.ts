import { Routes } from '@angular/router';
import { OilLayout } from './layout/oil-store.layout';
import { ListCloseAttention } from './pages/list-close-attention/list-close-attention';
import { RegisterCloseAttention } from './pages/register-close-attention/register-close-attention';
import { Measurement } from './pages/measurement/measurement';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: OilLayout,
    children: [
      {
        path: 'list-oil-store',
        component: ListCloseAttention,
      },
      {
        path: 'measurement',
        component: Measurement,
      },
      {
        path: 'register-close-attention/:type',
        component: RegisterCloseAttention,
      },
      {
        path: '**',
        redirectTo: 'list-oil-store',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

export default pagesRoutes;
