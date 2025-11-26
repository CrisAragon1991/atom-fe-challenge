import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('login');
  if (user) {
    return true;
  }
  return (inject(Router)).createUrlTree(['/login']);
};
