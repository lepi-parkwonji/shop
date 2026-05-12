import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqDTO, PaginatedResult, PublicApiService } from '../../../services/public-api.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule, PaginationComponent],
  template: `
    <div>
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

      <div class="card bg-base-100 shadow-sm">
        @if (result()?.items?.length === 0) {
          <div class="text-center text-base-content/40 py-10">등록된 FAQ가 없습니다.</div>
        } @else {
          <div class="divide-y divide-base-200">
            @for (item of result()?.items; track item.id) {
              <div class="collapse collapse-arrow">
                <input type="checkbox" />
                <div class="collapse-title font-medium flex items-center gap-2">
                  @if (item.isPinned) {
                    <span class="badge badge-warning badge-xs shrink-0">고정</span>
                  }
                  {{ item.question }}
                </div>
                <div class="collapse-content text-base-content/70 leading-relaxed">
                  <p class="whitespace-pre-wrap">{{ item.answer }}</p>
                </div>
              </div>
            }
          </div>
        }
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
  private api = inject(PublicApiService);

  result = signal<PaginatedResult<FaqDTO> | null>(null);
  pageNo = signal(1);
  query = '';
  private searchTimer?: ReturnType<typeof setTimeout>;

  ngOnInit() { this.load(); }
  ngOnDestroy() { clearTimeout(this.searchTimer); }

  load() {
    this.api.searchFaqs(this.pageNo(), 20, this.query || undefined)
      .subscribe(r => this.result.set(r));
  }

  onQueryChange() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.pageNo.set(1); this.load(); }, 400);
  }

  onSearchImmediate() { clearTimeout(this.searchTimer); this.pageNo.set(1); this.load(); }
  changePage(page: number) { this.pageNo.set(page); this.load(); }
}
