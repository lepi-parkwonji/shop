import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AdminStore } from '../stores/admin.store';

const checkAuth = async () => {
  const adminStore = inject(AdminStore);
  const router = inject(Router);

  if (adminStore.user()) return true;

  const ok = await adminStore.fetch();
  if (ok) return true;

  return router.createUrlTree(['/sign-in']);
};

export const authGuard: CanActivateFn = checkAuth;
export const authGuardChild: CanActivateChildFn = checkAuth;
