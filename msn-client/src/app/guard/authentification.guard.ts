import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service';
import { inject } from '@angular/core';

export const authentificationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthentificationService)
  const router = inject(Router)
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
