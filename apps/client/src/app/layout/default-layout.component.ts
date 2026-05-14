import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './top-bar.component';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, TopBarComponent],
  template: `
    <app-top-bar />
    <main class="min-h-screen bg-base-200">
      <router-outlet />
    </main>
  `,
})
export class DefaultLayoutComponent {}
