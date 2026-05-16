import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import {
  INQUIRY_TITLE_MIN, INQUIRY_TITLE_MAX,
  INQUIRY_CONTENT_MIN, INQUIRY_CONTENT_MAX,
  INQUIRY_AUTHOR_NAME_MAX,
} from '@demo-shop/common';

@Component({
  selector: 'app-inquiry-form',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="w-full">
      <div class="mb-5">
        <h2 class="text-xl font-bold">1:1 문의 등록</h2>
      </div>

      <div class="card bg-base-100 shadow-sm">
        <div class="card-body gap-4">

          <label class="form-control">
            <div class="label px-0 pb-2">
              <span class="label-text font-medium">작성자명</span>
            </div>
            <input
              class="input input-bordered w-full bg-base-200 cursor-not-allowed"
              type="text"
              [ngModel]="authorName"
              readonly
            />
          </label>

          <label class="form-control">
            <div class="label px-0 pb-2">
              <span class="label-text font-medium">제목 *</span>
              <span class="label-text-alt" [class.text-error]="title.length >= TITLE_MAX">{{ title.length }} / {{ TITLE_MAX }}</span>
            </div>
            <input
              class="input input-bordered w-full"
              type="text"
              [(ngModel)]="title"
              placeholder="제목을 입력하세요"
              [maxlength]="TITLE_MAX"
            />
          </label>

          <label class="form-control">
            <div class="label px-0 pb-2">
              <span class="label-text font-medium">내용 *</span>
              <span class="label-text-alt" [class.text-error]="content.length >= CONTENT_MAX">{{ content.length }} / {{ CONTENT_MAX }}</span>
            </div>
            <textarea
              class="textarea textarea-bordered w-full font-mono text-sm leading-relaxed"
              style="min-height: 16rem; resize: vertical;"
              [(ngModel)]="content"
              placeholder="문의 내용을 입력하세요"
              [maxlength]="CONTENT_MAX"
            ></textarea>
          </label>

          @if (errorMsg()) {
            <p class="text-error text-sm">{{ errorMsg() }}</p>
          }

          <div class="flex justify-end gap-2 pt-2">
            <a class="btn btn-ghost" routerLink="../">취소</a>
            <button class="btn btn-primary" [disabled]="loading()" (click)="onSubmit()">
              {{ loading() ? '등록 중...' : '등록' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class InquiryFormComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly TITLE_MIN = INQUIRY_TITLE_MIN;
  readonly TITLE_MAX = INQUIRY_TITLE_MAX;
  readonly CONTENT_MIN = INQUIRY_CONTENT_MIN;
  readonly CONTENT_MAX = INQUIRY_CONTENT_MAX;
  readonly AUTHOR_MAX = INQUIRY_AUTHOR_NAME_MAX;

  authorName = '';
  title = '';
  content = '';

  loading = signal(false);
  errorMsg = signal('');

  ngOnInit() {
    this.authorName = this.authService.user()?.nickname ?? '';
  }

  onSubmit() {
    this.errorMsg.set('');

    if (this.title.trim().length < this.TITLE_MIN) {
      this.errorMsg.set(`제목은 ${this.TITLE_MIN}자 이상 입력해주세요.`);
      return;
    }
    if (this.content.trim().length < this.CONTENT_MIN) {
      this.errorMsg.set(`내용은 ${this.CONTENT_MIN}자 이상 입력해주세요.`);
      return;
    }

    this.loading.set(true);
    this.http.post('/api/inquiry', {
      authorName: this.authorName,
      title: this.title.trim(),
      content: this.content.trim(),
    }).subscribe({
      next: () => {
        this.router.navigate(['/customer-service/inquiry']);
      },
      error: (err) => {
        const msg = err?.error?.message;
        this.errorMsg.set(Array.isArray(msg) ? msg[0] : (msg || '등록에 실패했습니다. 다시 시도해주세요.'));
        this.loading.set(false);
      },
    });
  }
}
