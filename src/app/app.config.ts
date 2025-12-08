import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ApiConfigService } from './services/api-config.service';
import { BASE_PATH } from './api/variables';

// Factory function to initialize API detection
export function initializeApp(apiConfigService: ApiConfigService) {
  return () => apiConfigService.detectApiUrl();
}

// Factory function to provide the detected BASE_PATH
export function apiBasePathFactory(apiConfigService: ApiConfigService) {
  return apiConfigService.getApiUrl();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ApiConfigService],
      multi: true,
    },
    {
      provide: BASE_PATH,
      useFactory: apiBasePathFactory,
      deps: [ApiConfigService],
    },
  ],
};
