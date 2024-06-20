import { HttpInterceptorFn } from '@angular/common/http';
import { AuthentificationService } from '../service/authentification.service';
import { inject } from '@angular/core';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authentificationService = inject(AuthentificationService);
  return next(req);
};
