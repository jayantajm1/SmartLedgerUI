import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { BrowserStorageService } from '../services/browser-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(BrowserStorageService);
  const token = storage.getItem('authToken');

  if (token) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
