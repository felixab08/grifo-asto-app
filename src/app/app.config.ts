import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import localEs from '@angular/common/locales/es-PE';

import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@auth/interceptors/auth.interceptor';
import { isLoginInterceptor } from '@auth/interceptors/token.interceptor';
import { confirmDeleteInterceptor } from '@auth/interceptors/http-confirm-delete.interceptor';
registerLocaleData(localEs, 'es', 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-PE',
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([isLoginInterceptor, authInterceptor, confirmDeleteInterceptor]),
    ),
  ],
};
