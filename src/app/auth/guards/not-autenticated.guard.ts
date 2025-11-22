import { inject } from '@angular/core';
import type { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const notAutenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());
  if (isAuthenticated) {
    await router.navigate(['/']);
    return false;
  }

  return true;
};
