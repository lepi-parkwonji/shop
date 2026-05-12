import { NgClass, SlicePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FaqApiService, FaqDTO } from '../../../services/faq-api.service';
import { PaginatedResult } from '../../../services/notice-api.service';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule, SlicePipe, NgClass, PaginationComponent],
  template: `
    <div class="w-full max-w-4xl">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold">FAQ</h2>
        <button class="btn btn-primary btn-sm" (click)="router.navigate(['/customer/faq/new'])">
          + 등록
        </button>
      </div>

      <div class="flex gap-2 mb-4">
        <input
          class="input input-bordered flex-1 input-sm min-w-0"
          type="text"
          [(ngModel)]="query"
          placeholder="질문 또는 답변 검색"
          (ngModelChange)="onQueryChange()"
          (keydown.enter)="onSearchImmediate()"
        />
        <button class="btn btn-outline btn-sm shrink-0" (click)="onSearchImmediate()">검색</button>
      </div>

      <div class="card bg-base-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-zebra table-fixed w-full">
            <thead>
              <tr>
                <th class="w-14">번호</th>
                <th>질문</th>
                <th class="w-28 text-center">고정</th>
                <th class="w-24 text-center">노출</th>
                <th class="w-28 hidden sm:table-cell">작성일</th>
                <th class="w-20 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              @for (item of result()?.items; track item.id) {
                <tr>
                  <td class="text-sm text-base-content/50">{{ item.id }}</td>
                  <td
                    class="cursor-pointer text-primary hover:underline truncate max-w-0"
                    (click)="router.navigate(['/customer/faq', item.id, 'edit'], { state: { faq: item } })"
                    [title]="item.question"
                  >{{ item.question }}</td>
                  <td class="text-center">
                    <button
                      class="btn btn-xs whitespace-nowrap"
                      [ngClass]="item.isPinned ? 'btn-warning' : 'btn-outline btn-warning'"
                      (click)="togglePin(item)"
                    >{{ item.isPinned ? '고정' : '고정안함' }}</button>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-xs whitespace-nowrap"
                      [ngClass]="item.isExposed ? 'btn-success' : 'btn-outline btn-success'"
                      (click)="toggleExpose(item)"
                    >{{ item.isExposed ? '노출' : '숨김' }}</button>
                  </td>
                  <td class="text-sm text-base-content/60 hidden sm:table-cell whitespace-nowrap">{{ item.createdAt | slice:0:10 }}</td>
                  <td class="text-center">
                    <button class="btn btn-xs btn-error btn-outline whitespace-nowrap" (click)="remove(item)">삭제</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="text-center text-base-content/40 py-10">등록된 FAQ가 없습니다.</td></tr>
              }
            </tbody>
          </table>
        </div>
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
export class FaqListComponent implements OnInit, OnDestroy {
  private faqApi = inject(FaqApiService);
  private toast = inject(ToastService);
  router = inject(Router);

  result = signal<PaginatedResult<FaqDTO> | null>(null);
  pageNo = signal(1);
  query = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() { this.load(); }
  ngOnDestroy() { clearTimeout(this.searchTimer); }

  load() {
    this.faqApi.search(this.pageNo(), 10, this.query || undefined).subscribe(r => this.result.set(r));
  }

  onQueryChange() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.pageNo.set(1); this.load(); }, 400);
  }

  onSearchImmediate() { clearTimeout(this.searchTimer); this.pageNo.set(1); this.load(); }
  changePage(page: number) { this.pageNo.set(page); this.load(); }

  togglePin(item: FaqDTO) {
    this.faqApi.togglePin(item.id).subscribe({
      next: (updated) => {
        this.result.update(r => r ? {
          ...r,
          items: r.items.map(i => i.id === item.id ? { ...i, isPinned: updated.isPinned } : i),
        } : null);
        this.toast.success(updated.isPinned ? 'FAQ가 고정되었습니다.' : '고정이 해제되었습니다.');
      },
      error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
    });
  }

  toggleExpose(item: FaqDTO) {
    this.faqApi.toggleExpose(item.id).subscribe({
      next: (updated) => {
        this.result.update(r => r ? {
          ...r,
          items: r.items.map(i => i.id === item.id ? { ...i, isExposed: updated.isExposed } : i),
        } : null);
        this.toast.success(updated.isExposed ? 'FAQ가 노출됩니다.' : 'FAQ가 숨김 처리되었습니다.');
      },
      error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
    });
  }

  remove(item: FaqDTO) {
    if (!confirm(`"${item.question}" FAQ를 삭제하시겠습니까?`)) return;
    this.faqApi.remove(item.id).subscribe({
      next: () => { this.toast.success('FAQ가 삭제되었습니다.'); this.load(); },
      error: () => this.toast.error('삭제 중 오류가 발생했습니다.'),
    });
  }
}
