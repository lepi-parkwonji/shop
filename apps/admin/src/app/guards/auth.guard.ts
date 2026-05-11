import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminStore } from '../stores/admin.store';

export const authGuard: CanActivateFn = async () => {
  const adminStore = inject(AdminStore);
  const router = inject(Router);

  if (adminStore.user()) return true;

  const ok = await adminStore.fetch();
  if (ok) return true;

  return router.createUrlTree(['/sign-in']);
};
