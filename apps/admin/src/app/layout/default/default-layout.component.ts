import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ToastService } from '../../services/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, TopBarComponent, SideMenuComponent, NgClass],
  template: `
    <app-top-bar />
    <div class="flex pt-14 min-h-screen">
      <app-side-menu />
      <main class="flex-1 p-6 bg-base-200 overflow-y-auto min-w-0">
        <router-outlet />
      </main>
    </div>

    <div class="toast toast-end toast-bottom z-50 gap-2 p-4">
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div
          class="alert shadow-lg max-w-sm w-full"
          [ngClass]="{
            'alert-success': toast.type === 'success',
            'alert-error': toast.type === 'error',
            'alert-warning': toast.type === 'warning',
            'alert-info': toast.type === 'info'
          }"
        >
          <span class="flex-1 text-sm">{{ toast.message }}</span>
          <button class="btn btn-xs btn-ghost" (click)="toastSvc.dismiss(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
})
export class DefaultLayoutComponent {
  toastSvc = inject(ToastService);
}
