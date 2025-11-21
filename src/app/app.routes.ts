import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'grifo',
    loadChildren: () => import('./oil-store/oil-store.routes'),
  },
  {
    path: '',
    redirectTo: 'grifo',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'grifo',
    pathMatch: 'full',
  },
];
