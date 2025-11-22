import { Routes } from '@angular/router';
import { notAutenticatedGuard } from '@auth/guards/not-autenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [notAutenticatedGuard],
  },
  {
    path: 'grifo',
    loadChildren: () => import('./oil-store/oil-store.routes'),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
