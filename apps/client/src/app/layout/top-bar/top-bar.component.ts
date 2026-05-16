import { Component, inject, computed, OnInit, OnDestroy, signal, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, TokensDTO } from '../../auth/auth.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  user = this.authService.user;
  isLoggedIn = computed(() => !!this.user());
  showLoginModal = signal(false);

  private messageListener?: (e: MessageEvent) => void;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.messageListener = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'KAKAO_LOGIN_SUCCESS') return;
      const tokens = e.data.tokens as TokensDTO;
      this.authService.saveTokens(tokens);
      this.ngZone.run(() => {
        this.showLoginModal.set(false); // 모달 즉시 닫기
        this.authService.fetch().catch(console.error); // 백그라운드 상태 업데이트
      });
    };
    window.addEventListener('message', this.messageListener);
  }

  ngOnDestroy() {
    if (this.messageListener) window.removeEventListener('message', this.messageListener);
  }

  openModal() { this.showLoginModal.set(true); }
  closeModal() { this.showLoginModal.set(false); }

  startKakaoLogin() {
    if (!isPlatformBrowser(this.platformId)) return;
    const redirectUri = window.location.origin + '/auth/callback';
    this.authService.getKakaoLoginUrl(redirectUri).subscribe({
      next: ({ url }) => {
        const w = 500, h = 600;
        const left = window.screenX + (window.outerWidth - w) / 2;
        const top = window.screenY + (window.outerHeight - h) / 2;
        window.open(url, 'kakao_login', `width=${w},height=${h},left=${left},top=${top}`);
      },
    });
  }

  logout() { this.authService.logout(); }
}

