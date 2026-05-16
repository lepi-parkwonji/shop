import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface UserDTO {
  id: number;
  nickname: string;
  email?: string;
  profileImage?: string;
}

export interface TokensDTO {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _user = signal<UserDTO | null>(null);
  readonly user = this._user.asReadonly();
  
  private fetchPromise: Promise<boolean> | null = null;

  getKakaoLoginUrl(redirectUri: string) {
    return this.http.get<{ url: string }>('/api/client/auth/kakao-url', { params: { redirectUri } });
  }

  kakaoLogin(code: string, redirectUri: string) {
    return this.http.post<TokensDTO>('/api/client/auth/kakao', { code, redirectUri });
  }

  signin(email: string, pass: string) {
    return this.http.post<TokensDTO>('/api/client/auth/signin', { email, password: pass });
  }

  signup(email: string, pass: string, nickname: string) {
    return this.http.post<{ success: boolean }>('/api/client/auth/signup', { email, password: pass, nickname });
  }

  saveTokens(tokens: TokensDTO) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('client_accessToken', tokens.accessToken);
      localStorage.setItem('client_refreshToken', tokens.refreshToken);
    }
  }

  private meApi() {
    return this.http.get<UserDTO>('/api/client/me');
  }

  private logoutApi() {
    return this.http.post<void>('/api/client/logout', {});
  }

  async fetch(): Promise<boolean> {
    if (this.fetchPromise) return this.fetchPromise;
    
    this.fetchPromise = firstValueFrom(this.meApi())
      .then(user => {
        this._user.set(user);
        this.fetchPromise = null;
        return true;
      })
      .catch(() => {
        this._user.set(null);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('client_accessToken');
          localStorage.removeItem('client_refreshToken');
        }
        this.fetchPromise = null;
        return false;
      });

    return this.fetchPromise;
  }

  async logout() {
    try {
      await firstValueFrom(this.logoutApi());
    } finally {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('client_accessToken');
        localStorage.removeItem('client_refreshToken');
      }
      this._user.set(null);
      this.router.navigate(['/']);
    }
  }
}
