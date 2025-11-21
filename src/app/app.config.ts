import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import localEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
registerLocaleData(localEs, 'es', 'es-ES');

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
      useValue: 'es-ES',
    },
    provideHttpClient(withFetch()),
  ],
};
