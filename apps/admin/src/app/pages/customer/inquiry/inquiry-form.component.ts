import { NgClass, SlicePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InquiryApiService, InquiryDTO } from '../../../services/inquiry-api.service';
import { ToastService } from '../../../services/toast.service';

const ANSWER_MAX = 2000;

@Component({
  selector: 'app-inquiry-form',
  imports: [FormsModule, SlicePipe, NgClass],
  templateUrl: './inquiry-form.component.html',
})
export class InquiryFormComponent implements OnInit {
  private inquiryApi = inject(InquiryApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly ANSWER_MAX = ANSWER_MAX;

  inquiry = signal<InquiryDTO | null>(null);
  answer = '';
  loading = signal(false);
  errorMsg = signal('');
  private inquiryId!: number;

  ngOnInit() {
    this.inquiryId = +this.route.snapshot.paramMap.get('id')!;

    const state = history.state as { inquiry?: InquiryDTO } | undefined;
    if (state?.inquiry) {
      this.inquiry.set(state.inquiry);
      this.answer = state.inquiry.answer ?? '';
    }

    this.inquiryApi.findOne(this.inquiryId).subscribe({
      next: (data) => {
        this.inquiry.set(data);
        this.answer = data.answer ?? '';
      },
      error: () => {
        if (!state?.inquiry) this.errorMsg.set('데이터를 불러오지 못했습니다.');
      },
    });
  }

  navigateBack() {
    this.router.navigate(['/customer/inquiry']);
  }

  onSubmit() {
    if (!this.answer.trim()) {
      this.errorMsg.set('답변을 입력해주세요.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    this.inquiryApi.answer(this.inquiryId, { answer: this.answer }).subscribe({
      next: () => {
        this.toast.success('답변이 등록되었습니다.');
        this.router.navigate(['/customer/inquiry']);
      },
      error: (error) => {
        const status = error?.status;
        if (status === 401) this.errorMsg.set('인증이 만료되었습니다. 다시 로그인해주세요.');
        else if (status === 404) this.errorMsg.set('문의를 찾을 수 없습니다.');
        else this.errorMsg.set(`저장 중 오류가 발생했습니다. (${status ?? 'network error'})`);
        this.loading.set(false);
      },
    });
  }
}
