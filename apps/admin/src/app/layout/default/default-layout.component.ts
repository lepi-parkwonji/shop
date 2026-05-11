import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, TopBarComponent, SideMenuComponent],
  template: `
    <app-top-bar />
    <div class="flex pt-14 min-h-screen">
      <app-side-menu />
      <main class="flex-1 p-6 bg-base-200 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DefaultLayoutComponent {}
