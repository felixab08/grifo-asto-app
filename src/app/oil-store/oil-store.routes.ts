import { Routes } from '@angular/router';
import { ListCloseAttention } from './pages/list-close-attention/list-close-attention';
import { RegisterCloseAttention } from './pages/register-close-attention/register-close-attention';
import { OilLayout } from './layout/oil-store.layout';

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
        path: 'Register-close-attention',
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
  },
];

export default pagesRoutes;
