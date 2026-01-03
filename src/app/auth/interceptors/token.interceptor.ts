import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function isLoginInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const _router = inject(Router);
  const _authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && req.url.split('/').pop() !== 'login') {
        // Limpiar el localStorage
        _authService.logoutAndReload();
        // (Opcional) Mostrar un mensaje
        console.warn('Sesión expirada, redirigiendo al home.');
      }
      return throwError(() => error);
    })
  );
}
