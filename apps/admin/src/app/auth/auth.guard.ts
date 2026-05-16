import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const checkAuth = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 인터셉터가 localStorage를 지웠지만 user 시그널은 남아 있는 경우를 방지
  if (authService.user() && localStorage.getItem('accessToken')) return true;

  const ok = await authService.fetch();
  if (ok) return true;

  return router.createUrlTree(['/sign-in']);
};

export const authGuard: CanActivateFn = checkAuth;
export const authGuardChild: CanActivateChildFn = checkAuth;
