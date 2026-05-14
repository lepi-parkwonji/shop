import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [NgClass],
  template: `
    @if (totalPages() > 0) {
      <div class="flex flex-col items-center gap-2 mt-4">
        <div class="join">
          <button
            class="join-item btn btn-sm btn-ghost"
            [disabled]="pageNo() <= 1"
            (click)="go(1)"
            title="첫 페이지"
          >«</button>
          <button
            class="join-item btn btn-sm btn-ghost"
            [disabled]="pageNo() <= 1"
            (click)="go(pageNo() - 1)"
            title="이전 페이지"
          >‹</button>

          @for (page of pages(); track $index) {
            @if (page === null) {
              <button class="join-item btn btn-sm btn-ghost pointer-events-none" disabled>…</button>
            } @else {
              <button
                class="join-item btn btn-sm"
                [ngClass]="page === pageNo() ? 'btn-primary' : 'btn-ghost'"
                (click)="go(page)"
              >{{ page }}</button>
            }
          }

          <button
            class="join-item btn btn-sm btn-ghost"
            [disabled]="pageNo() >= totalPages()"
            (click)="go(pageNo() + 1)"
            title="다음 페이지"
          >›</button>
          <button
            class="join-item btn btn-sm btn-ghost"
            [disabled]="pageNo() >= totalPages()"
            (click)="go(totalPages())"
            title="마지막 페이지"
          >»</button>
        </div>
        <span class="text-sm text-base-content/50">총 {{ totalItems() }}건</span>
      </div>
    }
  `,
})
export class PaginationComponent {
  pageNo = input.required<number>();
  totalPages = input.required<number>();
  totalItems = input.required<number>();
  pageChange = output<number>();

  pages = computed((): (number | null)[] => {
    const total = this.totalPages();
    const current = this.pageNo();

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const result: (number | null)[] = [1];

    const rangeStart = Math.max(2, current - 2);
    const rangeEnd = Math.min(total - 1, current + 2);

    if (rangeStart > 2) result.push(null);
    for (let page = rangeStart; page <= rangeEnd; page++) result.push(page);
    if (rangeEnd < total - 1) result.push(null);

    result.push(total);
    return result;
  });

  go(page: number) {
    if (page === this.pageNo()) return;
    this.pageChange.emit(page);
  }
}
