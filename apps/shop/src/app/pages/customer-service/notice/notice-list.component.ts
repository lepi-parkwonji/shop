import { SlicePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoticeDTO, PaginatedResult, PublicApiService } from '../../../services/public-api.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-notice-list',
  imports: [FormsModule, SlicePipe, RouterLink, PaginationComponent],
  template: `
    <div>
      <div class="flex gap-2 mb-4">
        <input
          class="input input-bordered flex-1 input-sm min-w-0"
          type="text"
          [(ngModel)]="query"
          placeholder="제목 또는 내용 검색"
          (ngModelChange)="onQueryChange()"
          (keydown.enter)="onSearchImmediate()"
        />
        <button class="btn btn-outline btn-sm shrink-0" (click)="onSearchImmediate()">검색</button>
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
        <app-pagination
          [pageNo]="pageNo()"
          [totalPages]="r.pageInfo.totalPages"
          [totalItems]="r.pageInfo.totalItems"
          (pageChange)="changePage($event)"
        />
      }
    </div>
  `,
})
export class NoticeListComponent implements OnInit, OnDestroy {
  private api = inject(PublicApiService);

  result = signal<PaginatedResult<NoticeDTO> | null>(null);
  pageNo = signal(1);
  query = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() { this.load(); }
  ngOnDestroy() { clearTimeout(this.searchTimer); }

  load() {
    this.api.searchNotices(this.pageNo(), 10, this.query || undefined)
      .subscribe(r => this.result.set(r));
  }

  onQueryChange() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.pageNo.set(1); this.load(); }, 400);
  }

  onSearchImmediate() { clearTimeout(this.searchTimer); this.pageNo.set(1); this.load(); }
  changePage(page: number) { this.pageNo.set(page); this.load(); }
}
