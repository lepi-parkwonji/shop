import { NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InquiryApiService, InquiryDTO } from '../../../services/inquiry-api.service';
import { PaginatedResult } from '../../../services/notice-api.service';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-inquiry-list',
  imports: [FormsModule, SlicePipe, NgClass, PaginationComponent],
  templateUrl: './inquiry-list.component.html',
})
export class InquiryListComponent {
  private inquiryApi = inject(InquiryApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  result = signal<PaginatedResult<InquiryDTO> | null>(null);
  pageNo = signal(1);
  query = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  navigateToAnswer(item: InquiryDTO) {
    this.router.navigate(['/customer/inquiry', item.id, 'answer'], { state: { inquiry: item } });
  }

  load() {
    this.inquiryApi.search(this.pageNo(), 10, this.query() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => this.result.set(response))
  }

  onQueryChange(value: string) {
    this.query.set(value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.pageNo.set(1); this.load(); }, 400);
  }

  onSearchImmediate() { clearTimeout(this.searchTimer); this.pageNo.set(1); this.load(); }
  changePage(page: number) { this.pageNo.set(page); this.load(); }

  rowNumber(index: number): number {
    const { totalItems, pageSize } = this.result()!.pageInfo;
    return totalItems - ((this.pageNo() - 1) * pageSize + index);
  }

  toggleExpose(item: InquiryDTO) {
    this.inquiryApi.toggleExpose(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.result.update(current => current ? {
            ...current,
            items: current.items.map(existing => existing.id === item.id ? { ...existing, isExposed: updated.isExposed } : existing),
          } : null);
          this.toast.success(updated.isExposed ? '문의가 노출됩니다.' : '문의가 숨김 처리되었습니다.');
        },
        error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
      });
  }

  remove(item: InquiryDTO) {
    if (!confirm(`"${item.title}" 문의를 삭제하시겠습니까?`)) return;
    this.inquiryApi.remove(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toast.success('문의가 삭제되었습니다.'); this.load(); },
        error: () => this.toast.error('삭제 중 오류가 발생했습니다.'),
      });
  }
}
