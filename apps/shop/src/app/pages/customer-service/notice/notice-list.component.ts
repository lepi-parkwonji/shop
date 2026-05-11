import { SlicePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticeDTO, PaginatedResult, PublicApiService } from '../../../services/public-api.service';

@Component({
  selector: 'app-notice-list',
  imports: [FormsModule, SlicePipe, RouterLink],
  template: `
    <div>
      <div class="flex gap-2 mb-4">
        <input
          class="input input-bordered flex-1 input-sm"
          type="text" [(ngModel)]="query" placeholder="제목 또는 내용 검색"
          (keydown.enter)="onSearch()"
        />
        <button class="btn btn-neutral btn-sm" (click)="onSearch()">검색</button>
      </div>

      <div class="card bg-base-100 shadow-sm">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th class="w-16 hidden sm:table-cell">번호</th>
              <th>제목</th>
              <th class="w-28 hidden sm:table-cell">작성일</th>
            </tr>
          </thead>
          <tbody>
            @for (item of result()?.items; track item.id) {
              <tr class="cursor-pointer hover" [routerLink]="[item.id]">
                <td class="text-sm text-base-content/50 hidden sm:table-cell">{{ item.id }}</td>
                <td>
                  <span class="font-medium">{{ item.title }}</span>
                  @if (item.isPinned) {
                    <span class="badge badge-warning badge-xs ml-2">공지</span>
                  }
                </td>
                <td class="text-sm text-base-content/60 hidden sm:table-cell">{{ item.createdAt | slice:0:10 }}</td>
              </tr>
            } @empty {
              <tr><td colspan="3" class="text-center text-base-content/40 py-10">등록된 공지사항이 없습니다.</td></tr>
            }
          </tbody>
        </table>
      </div>

      @if (result(); as r) {
        <div class="flex justify-center items-center gap-4 mt-4">
          <button class="btn btn-sm btn-ghost" [disabled]="pageNo() <= 1" (click)="changePage(pageNo() - 1)">이전</button>
          <span class="text-sm">{{ pageNo() }} / {{ r.pageInfo.totalPages || 1 }}</span>
          <button class="btn btn-sm btn-ghost" [disabled]="pageNo() >= r.pageInfo.totalPages" (click)="changePage(pageNo() + 1)">다음</button>
        </div>
      }
    </div>
  `,
})
export class NoticeListComponent implements OnInit {
  private api = inject(PublicApiService);

  result = signal<PaginatedResult<NoticeDTO> | null>(null);
  pageNo = signal(1);
  query = '';

  ngOnInit() { this.load(); }

  load() {
    this.api.searchNotices(this.pageNo(), 10, this.query || undefined)
      .subscribe(r => this.result.set(r));
  }

  onSearch() { this.pageNo.set(1); this.load(); }
  changePage(page: number) { this.pageNo.set(page); this.load(); }
}
