import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticeApiService, NoticeDTO } from '../../../services/notice-api.service';
import { ToastService } from '../../../services/toast.service';

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

@Component({
  selector: 'app-notice-form',
  imports: [FormsModule],
  templateUrl: './notice-form.component.html',
})
export class NoticeFormComponent implements OnInit {
  private noticeApi = inject(NoticeApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly TITLE_MAX = TITLE_MAX;
  readonly CONTENT_MAX = CONTENT_MAX;

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

    const state = history.state as { notice?: NoticeDTO } | undefined;
    if (state?.notice) {
      this.title = state.notice.title;
      this.content = state.notice.content;
    }

    this.noticeApi.findOne(this.noticeId).subscribe({
      next: (notice) => {
        this.title = notice.title;
        this.content = notice.content;
      },
      error: (error) => {
        console.error('[notice findOne]', error);
        if (!state?.notice) {
          this.errorMsg.set('데이터를 불러오지 못했습니다.');
        }
      },
    });
  }

  navigateBack() {
    this.router.navigate(['/customer/notice']);
  }

  onSubmit() {
    if (!this.title.trim() || !this.content.trim()) {
      this.errorMsg.set('제목과 내용을 모두 입력해주세요.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    const saveRequest = this.isEdit && this.noticeId
      ? this.noticeApi.update(this.noticeId, { title: this.title, content: this.content })
      : this.noticeApi.create({ title: this.title, content: this.content });

    saveRequest.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
        this.router.navigate(['/customer/notice']);
      },
      error: (error) => {
        console.error('[notice save]', error);
        const status = error?.status;
        if (status === 401) this.errorMsg.set('인증이 만료되었습니다. 다시 로그인해주세요.');
        else if (status === 404) this.errorMsg.set('공지사항을 찾을 수 없습니다.');
        else this.errorMsg.set(`저장 중 오류가 발생했습니다. (${status ?? 'network error'})`);
        this.loading.set(false);
      },
    });
  }
}
