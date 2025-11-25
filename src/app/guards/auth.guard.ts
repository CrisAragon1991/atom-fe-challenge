import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  }
  // Redirige a login si no hay usuario
  return (inject(Router)).createUrlTree(['/login']);
};
