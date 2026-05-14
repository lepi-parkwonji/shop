import { SlicePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoticeDTO, PublicApiService } from '../../../services/public-api.service';

@Component({
  selector: 'app-notice-detail',
  imports: [SlicePipe, RouterLink],
  templateUrl: './notice-detail.component.html',
})
export class NoticeDetailComponent implements OnInit {
  private api = inject(PublicApiService);
  private route = inject(ActivatedRoute);

  notice = signal<NoticeDTO | null>(null);
  error = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.findOneNotice(id).subscribe({
      next: notice => this.notice.set(notice),
      error: () => this.error.set('공지사항을 불러올 수 없습니다.'),
    });
  }
}
