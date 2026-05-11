import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticeApiService, NoticeDTO } from '../../../services/notice-api.service';

@Component({
  selector: 'app-notice-form',
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl">
      <div class="mb-5">
        <h2 class="text-xl font-bold">{{ isEdit ? '공지사항 수정' : '공지사항 등록' }}</h2>
      </div>

      <div class="card bg-base-100 shadow-sm">
        <div class="card-body gap-4">
          <label class="form-control">
            <div class="label"><span class="label-text font-medium">제목 *</span></div>
            <input
              class="input input-bordered w-full"
              type="text" [(ngModel)]="title" placeholder="제목을 입력하세요"
            />
          </label>

          <label class="form-control">
            <div class="label"><span class="label-text font-medium">내용 *</span></div>
            <textarea
              class="textarea textarea-bordered w-full min-h-48"
              [(ngModel)]="content" placeholder="내용을 입력하세요"
            ></textarea>
          </label>

          @if (errorMsg()) {
            <p class="text-error text-sm">{{ errorMsg() }}</p>
          }

          <div class="flex justify-end gap-2 pt-2">
            <button class="btn btn-ghost" (click)="router.navigate(['/customer/notice'])">취소</button>
            <button class="btn btn-primary" [disabled]="loading()" (click)="onSubmit()">
              {{ loading() ? '저장 중...' : '저장' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NoticeFormComponent implements OnInit {
  private noticeApi = inject(NoticeApiService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  title = '';
  content = '';
  loading = signal(false);
  errorMsg = signal('');
  isEdit = false;
  private noticeId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEdit = true;
    this.noticeId = +id;

    // 리스트에서 navigation state로 넘긴 데이터로 즉시 채움
    const state = history.state as { notice?: NoticeDTO } | undefined;
    if (state?.notice) {
      this.title = state.notice.title;
      this.content = state.notice.content;
    }

    // API로 최신 데이터 재확인 (state 없거나 stale 대비)
    this.noticeApi.findOne(this.noticeId).subscribe({
      next: (n) => {
        this.title = n.title;
        this.content = n.content;
      },
      error: (err) => {
        console.error('[notice findOne]', err);
        if (!state?.notice) {
          this.errorMsg.set('데이터를 불러오지 못했습니다.');
        }
      },
    });
  }

  onSubmit() {
    if (!this.title.trim() || !this.content.trim()) {
      this.errorMsg.set('제목과 내용을 모두 입력해주세요.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    const req = this.isEdit && this.noticeId
      ? this.noticeApi.update(this.noticeId, { title: this.title, content: this.content })
      : this.noticeApi.create({ title: this.title, content: this.content });

    req.subscribe({
      next: () => this.router.navigate(['/customer/notice']),
      error: (err) => {
        console.error('[notice save]', err);
        const status = err?.status;
        if (status === 401) this.errorMsg.set('인증이 만료되었습니다. 다시 로그인해주세요.');
        else if (status === 404) this.errorMsg.set('공지사항을 찾을 수 없습니다.');
        else this.errorMsg.set(`저장 중 오류가 발생했습니다. (${status ?? 'network error'})`);
        this.loading.set(false);
      },
    });
  }
}
