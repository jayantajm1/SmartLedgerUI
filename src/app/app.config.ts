import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ApiConfigService } from './services/api-config.service';
import { BASE_PATH } from './api/variables';
import { AuthClient, API_BASE_URL } from './api/nswag-client';
import { OpenAPI } from './api/core/OpenAPI';
import { BrowserStorageService } from './services/browser-storage.service';

// Factory function to initialize API detection
export function initializeApp(apiConfigService: ApiConfigService) {
  return () => apiConfigService.detectApiUrl();
}

// Factory function to configure OpenAPI
export function initializeOpenAPI(storage: BrowserStorageService) {
  return () => {
    OpenAPI.TOKEN = () => {
      const token = storage.getItem('authToken');
      return token ? Promise.resolve(token) : Promise.resolve('');
    };
  };
}

// Factory function to provide the detected BASE_PATH
export function apiBasePathFactory(apiConfigService: ApiConfigService, storage: BrowserStorageService) {
  // First check if we have a stored detected URL
  const storedUrl = storage.getItem('detectedApiUrl');
  if (storedUrl && storedUrl.trim() !== '') {
    return storedUrl;
  }

  // Then check the service
  const serviceUrl = apiConfigService.getApiUrl();
  if (serviceUrl && serviceUrl.trim() !== '') {
    return serviceUrl;
  }

  // Finally fallback to environment default
  return 'http://localhost:5239'; // Use the detected URL as fallback
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ApiConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeOpenAPI,
      deps: [BrowserStorageService],
      multi: true,
    },
    {
      provide: BASE_PATH,
      useFactory: apiBasePathFactory,
      deps: [ApiConfigService, BrowserStorageService],
    },
    {
      provide: API_BASE_URL,
      useFactory: apiBasePathFactory,
      deps: [ApiConfigService, BrowserStorageService],
    },
    AuthClient,
  ],
};
