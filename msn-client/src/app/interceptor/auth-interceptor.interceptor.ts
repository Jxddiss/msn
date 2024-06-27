import { HttpInterceptorFn } from '@angular/common/http';
import { AuthentificationService } from '../service/authentification.service';
import { inject } from '@angular/core';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if(req.url.includes('/login') || req.url.includes('/inscription')) {
    return next(req);
  }

  const authentificationService = inject(AuthentificationService);
  authentificationService.loadToken();
  const token = authentificationService.getToken();
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(cloned);
};
