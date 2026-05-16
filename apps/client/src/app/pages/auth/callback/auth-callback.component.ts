import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const code = this.route.snapshot.queryParamMap.get('code');
    if (!code) {
      this.closeOrRedirect();
      return;
    }

    const redirectUri = window.location.origin + '/auth/callback';
    this.authService.kakaoLogin(code, redirectUri).subscribe({
      next: (tokens) => {
        // 팝업으로 열린 경우 → 부모 창에 토큰 전달 후 닫기
        if (window.opener) {
          window.opener.postMessage({ type: 'KAKAO_LOGIN_SUCCESS', tokens }, window.location.origin);
          window.close();
        } else {
          // 리다이렉트 방식 폴백
          this.authService.saveTokens(tokens);
          this.authService.fetch().then(() => this.router.navigate(['/']));
        }
      },
      error: () => this.closeOrRedirect(),
    });
  }

  private closeOrRedirect() {
    if (window.opener) {
      window.close();
    } else {
      this.router.navigate(['/']);
    }
  }
}
