import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../../services/admin-api.service';
import { AdminStore } from '../../../stores/admin.store';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body gap-4">
          <h1 class="text-xl font-bold text-center">관리자 로그인</h1>
          <form class="flex flex-col gap-3" (ngSubmit)="onSubmit()">
            <label class="form-control">
              <div class="label"><span class="label-text">아이디</span></div>
              <input
                class="input input-bordered w-full"
                type="text" [(ngModel)]="usrname" name="usrname"
                placeholder="아이디" required
              />
            </label>
            <label class="form-control">
              <div class="label"><span class="label-text">비밀번호</span></div>
              <input
                class="input input-bordered w-full"
                type="password" [(ngModel)]="password" name="password"
                placeholder="비밀번호" required
              />
            </label>
            @if (errorMsg()) {
              <p class="text-error text-sm">{{ errorMsg() }}</p>
            }
            <button class="btn btn-primary w-full mt-2" type="submit" [disabled]="loading()">
              {{ loading() ? '로그인 중...' : '로그인' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class SignInComponent {
  private adminApi = inject(AdminApiService);
  private adminStore = inject(AdminStore);
  private router = inject(Router);

  usrname = '';
  password = '';
  loading = signal(false);
  errorMsg = signal('');

  async onSubmit() {
    if (!this.usrname || !this.password) return;
    this.loading.set(true);
    this.errorMsg.set('');

    this.adminApi.signin(this.usrname, this.password).subscribe({
      next: (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        this.adminStore.fetch().then(() => this.router.navigate(['/']));
      },
      error: () => {
        this.errorMsg.set('아이디 또는 비밀번호가 올바르지 않습니다.');
        this.loading.set(false);
      },
    });
  }
}
