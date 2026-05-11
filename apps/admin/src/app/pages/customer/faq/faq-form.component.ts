import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqApiService, FaqDTO } from '../../../services/faq-api.service';

@Component({
  selector: 'app-faq-form',
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl">
      <div class="mb-5">
        <h2 class="text-xl font-bold">{{ isEdit ? 'FAQ 수정' : 'FAQ 등록' }}</h2>
      </div>

      <div class="card bg-base-100 shadow-sm">
        <div class="card-body gap-4">
          <label class="form-control">
            <div class="label"><span class="label-text font-medium">질문 *</span></div>
            <input
              class="input input-bordered w-full"
              type="text" [(ngModel)]="question" placeholder="질문을 입력하세요"
            />
          </label>

          <label class="form-control">
            <div class="label"><span class="label-text font-medium">답변 *</span></div>
            <textarea
              class="textarea textarea-bordered w-full min-h-40"
              [(ngModel)]="answer" placeholder="답변을 입력하세요"
            ></textarea>
          </label>

          @if (errorMsg()) {
            <p class="text-error text-sm">{{ errorMsg() }}</p>
          }

          <div class="flex justify-end gap-2 pt-2">
            <button class="btn btn-ghost" (click)="router.navigate(['/customer/faq'])">취소</button>
            <button class="btn btn-primary" [disabled]="loading()" (click)="onSubmit()">
              {{ loading() ? '저장 중...' : '저장' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FaqFormComponent implements OnInit {
  private faqApi = inject(FaqApiService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  question = '';
  answer = '';
  loading = signal(false);
  errorMsg = signal('');
  isEdit = false;
  private faqId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isEdit = true;
    this.faqId = +id;

    // 리스트에서 navigation state로 넘긴 데이터로 즉시 채움
    const state = history.state as { faq?: FaqDTO } | undefined;
    if (state?.faq) {
      this.question = state.faq.question;
      this.answer = state.faq.answer;
    }

    // API로 최신 데이터 재확인
    this.faqApi.findOne(this.faqId).subscribe({
      next: (f) => {
        this.question = f.question;
        this.answer = f.answer;
      },
      error: (err) => {
        console.error('[faq findOne]', err);
        if (!state?.faq) {
          this.errorMsg.set('데이터를 불러오지 못했습니다.');
        }
      },
    });
  }

  onSubmit() {
    if (!this.question.trim() || !this.answer.trim()) {
      this.errorMsg.set('질문과 답변을 모두 입력해주세요.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    const req = this.isEdit && this.faqId
      ? this.faqApi.update(this.faqId, { question: this.question, answer: this.answer })
      : this.faqApi.create({ question: this.question, answer: this.answer });

    req.subscribe({
      next: () => this.router.navigate(['/customer/faq']),
      error: (err) => {
        console.error('[faq save]', err);
        const status = err?.status;
        if (status === 401) this.errorMsg.set('인증이 만료되었습니다. 다시 로그인해주세요.');
        else if (status === 404) this.errorMsg.set('FAQ를 찾을 수 없습니다.');
        else this.errorMsg.set(`저장 중 오류가 발생했습니다. (${status ?? 'network error'})`);
        this.loading.set(false);
      },
    });
  }
}
