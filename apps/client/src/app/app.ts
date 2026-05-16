import { Component, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `<router-outlet />`,
})
export class App {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && localStorage.getItem('client_accessToken')) {
        this.authService.fetch();
      }
    });
  }
}
