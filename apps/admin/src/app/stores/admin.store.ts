import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AdminApiService, AdminDTO } from '../services/admin-api.service';

@Injectable({ providedIn: 'root' })
export class AdminStore {
  private adminApi = inject(AdminApiService);
  private router = inject(Router);

  private _user = signal<AdminDTO | null>(null);
  readonly user = this._user.asReadonly();

  async fetch(): Promise<boolean> {
    try {
      const admin = await firstValueFrom(this.adminApi.me());
      this._user.set(admin);
      return true;
    } catch {
      this._user.set(null);
      return false;
    }
  }

  setUser(user: AdminDTO) {
    this._user.set(user);
  }

  async logout() {
    try {
      await firstValueFrom(this.adminApi.logout());
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this._user.set(null);
      this.router.navigate(['/sign-in']);
    }
  }
}
