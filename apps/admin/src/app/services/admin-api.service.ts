import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AdminDTO {
  id: number;
  usrname: string;
  displayName: string;
}

export interface TokensDTO {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);

  signin(usrname: string, password: string) {
    return this.http.post<TokensDTO>('/api/admin/signin', { usrname, password });
  }

  me() {
    return this.http.get<AdminDTO>('/api/admin/me');
  }

  logout() {
    return this.http.post<void>('/api/admin/logout', {});
  }
}
