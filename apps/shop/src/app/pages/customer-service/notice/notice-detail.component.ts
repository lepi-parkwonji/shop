import { SlicePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoticeDTO, PublicApiService } from '../../../services/public-api.service';

@Component({
  selector: 'app-notice-detail',
  imports: [SlicePipe, RouterLink],
  template: `
    @if (notice()) {
      <div>
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <div class="border-b border-base-200 pb-4 mb-4">
              <h2 class="text-xl font-bold">{{ notice()!.title }}</h2>
              <p class="text-sm text-base-content/50 mt-1">{{ notice()!.createdAt | slice:0:10 }}</p>
            </div>
            <div class="whitespace-pre-wrap leading-relaxed">{{ notice()!.content }}</div>
          </div>
        </div>
        <div class="mt-4">
          <a routerLink="../" class="btn btn-ghost btn-sm">← 목록으로</a>
        </div>
      </div>
    } @else if (error()) {
      <div class="text-center py-10 text-base-content/40">{{ error() }}</div>
    } @else {
      <div class="flex justify-center py-10"><span class="loading loading-spinner"></span></div>
    }
  `,
})
export class NoticeDetailComponent implements OnInit {
  private api = inject(PublicApiService);
  private route = inject(ActivatedRoute);

  notice = signal<NoticeDTO | null>(null);
  error = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.findOneNotice(id).subscribe({
      next: n => this.notice.set(n),
      error: () => this.error.set('공지사항을 불러올 수 없습니다.'),
    });
  }
}
