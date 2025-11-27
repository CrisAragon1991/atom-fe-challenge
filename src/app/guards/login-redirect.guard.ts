import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const login = localStorage.getItem('login');
  if (login) {
    const router = inject(Router);
    router.navigate(['/todo']);
    return false;
  }
  return true;
};
