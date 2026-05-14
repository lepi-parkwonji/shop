import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../../services/admin-api.service';
import { AdminStore } from '../../../stores/admin.store';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
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
