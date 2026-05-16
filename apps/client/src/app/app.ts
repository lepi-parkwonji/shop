import { Component, inject, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `<router-outlet />`,
})
export class App {
  private authService = inject(AuthService);

  constructor() {
    // ngOnInit은 SSR 서버에서도 실행되어 localStorage에 접근 불가
    // afterNextRender는 브라우저에서만 실행 보장
    afterNextRender(() => {
      this.authService.fetch();
    });
  }
}
