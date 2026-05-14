import { NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FaqApiService, FaqDTO } from '../../../services/faq-api.service';
import { PaginatedResult } from '../../../services/notice-api.service';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule, SlicePipe, NgClass, PaginationComponent],
  templateUrl: './faq-list.component.html',
})
export class FaqListComponent {
  private faqApi = inject(FaqApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  result = signal<PaginatedResult<FaqDTO> | null>(null);
  pageNo = signal(1);
  query = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  navigateToNew() {
    this.router.navigate(['/customer/faq/new']);
  }

  navigateToEdit(item: FaqDTO) {
    this.router.navigate(['/customer/faq', item.id, 'edit'], { state: { faq: item } });
  }

  load() {
    this.faqApi.search(this.pageNo(), 10, this.query() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(response => this.result.set(response));
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

  togglePin(item: FaqDTO) {
    this.faqApi.togglePin(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.result.update(current => current ? {
            ...current,
            items: current.items.map(existingItem => existingItem.id === item.id ? { ...existingItem, isPinned: updated.isPinned } : existingItem),
          } : null);
          this.toast.success(updated.isPinned ? 'FAQ가 고정되었습니다.' : '고정이 해제되었습니다.');
        },
        error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
      });
  }

  toggleExpose(item: FaqDTO) {
    this.faqApi.toggleExpose(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.result.update(current => current ? {
            ...current,
            items: current.items.map(existingItem => existingItem.id === item.id ? { ...existingItem, isExposed: updated.isExposed } : existingItem),
          } : null);
          this.toast.success(updated.isExposed ? 'FAQ가 노출됩니다.' : 'FAQ가 숨김 처리되었습니다.');
        },
        error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
      });
  }

  remove(item: FaqDTO) {
    if (!confirm(`"${item.question}" FAQ를 삭제하시겠습니까?`)) return;
    this.faqApi.remove(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toast.success('FAQ가 삭제되었습니다.'); this.load(); },
        error: () => this.toast.error('삭제 중 오류가 발생했습니다.'),
      });
  }
}
