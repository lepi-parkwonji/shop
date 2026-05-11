import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqDTO, PaginatedResult, PublicApiService } from '../../../services/public-api.service';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex gap-2 mb-4">
        <input
          class="input input-bordered flex-1 input-sm"
          type="text" [(ngModel)]="query" placeholder="질문 또는 답변 검색"
          (keydown.enter)="onSearch()"
        />
        <button class="btn btn-neutral btn-sm" (click)="onSearch()">검색</button>
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
        @if (r.pageInfo.totalPages > 1) {
          <div class="flex justify-center items-center gap-4 mt-4">
            <button class="btn btn-sm btn-ghost" [disabled]="pageNo() <= 1" (click)="changePage(pageNo() - 1)">이전</button>
            <span class="text-sm">{{ pageNo() }} / {{ r.pageInfo.totalPages }}</span>
            <button class="btn btn-sm btn-ghost" [disabled]="pageNo() >= r.pageInfo.totalPages" (click)="changePage(pageNo() + 1)">다음</button>
          </div>
        }
      }
    </div>
  `,
})
export class FaqListComponent implements OnInit {
  private api = inject(PublicApiService);

  result = signal<PaginatedResult<FaqDTO> | null>(null);
  pageNo = signal(1);
  query = '';

  ngOnInit() { this.load(); }

  load() {
    this.api.searchFaqs(this.pageNo(), 20, this.query || undefined)
      .subscribe(r => this.result.set(r));
  }

  onSearch() { this.pageNo.set(1); this.load(); }
  changePage(page: number) { this.pageNo.set(page); this.load(); }
}
