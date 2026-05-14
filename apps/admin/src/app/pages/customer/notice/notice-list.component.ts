import { NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoticeApiService, NoticeDTO, PaginatedResult } from '../../../services/notice-api.service';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-notice-list',
  imports: [FormsModule, SlicePipe, NgClass, PaginationComponent],
  templateUrl: './notice-list.component.html',
})
export class NoticeListComponent {
  private noticeApi = inject(NoticeApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  result = signal<PaginatedResult<NoticeDTO> | null>(null);
  pageNo = signal(1);
  query = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  navigateToNew() {
    this.router.navigate(['/customer/notice/new']);
  }

  navigateToEdit(item: NoticeDTO) {
    this.router.navigate(['/customer/notice', item.id, 'edit'], { state: { notice: item } });
  }

  load() {
    this.noticeApi.search(this.pageNo(), 10, this.query() || undefined)
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

  togglePin(item: NoticeDTO) {
    this.noticeApi.togglePin(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.result.update(current => current ? {
            ...current,
            items: current.items.map(existingItem => existingItem.id === item.id ? { ...existingItem, isPinned: updated.isPinned } : existingItem),
          } : null);
          this.toast.success(updated.isPinned ? '공지사항이 고정되었습니다.' : '고정이 해제되었습니다.');
        },
        error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
      });
  }

  toggleExpose(item: NoticeDTO) {
    this.noticeApi.toggleExpose(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.result.update(current => current ? {
            ...current,
            items: current.items.map(existingItem => existingItem.id === item.id ? { ...existingItem, isExposed: updated.isExposed } : existingItem),
          } : null);
          this.toast.success(updated.isExposed ? '공지사항이 노출됩니다.' : '공지사항이 숨김 처리되었습니다.');
        },
        error: () => this.toast.error('변경 중 오류가 발생했습니다.'),
      });
  }

  remove(item: NoticeDTO) {
    if (!confirm(`"${item.title}" 공지사항을 삭제하시겠습니까?`)) return;
    this.noticeApi.remove(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toast.success('공지사항이 삭제되었습니다.'); this.load(); },
        error: () => this.toast.error('삭제 중 오류가 발생했습니다.'),
      });
  }
}
