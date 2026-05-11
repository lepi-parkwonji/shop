import { Component, inject } from '@angular/core';
import { AdminStore } from '../../stores/admin.store';

@Component({
  selector: 'app-top-bar',
  template: `
    <header class="navbar bg-neutral text-neutral-content fixed top-0 left-0 right-0 z-50 h-14 min-h-14 px-6">
      <div class="flex-1">
        <span class="text-base font-bold">Demo Shop 관리자</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-neutral-content/60">{{ adminStore.user()?.displayName }}</span>
        <button class="btn btn-sm btn-outline btn-neutral-content" (click)="adminStore.logout()">
          로그아웃
        </button>
      </div>
    </header>
  `,
})
export class TopBarComponent {
  adminStore = inject(AdminStore);
}
