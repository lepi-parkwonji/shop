import { SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginatedResult } from '../../../services/notice-api.service';
import { GalleryApiService, GalleryDTO } from '../../../services/gallery-api.service';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-gallery-list',
  imports: [FormsModule, SlicePipe, PaginationComponent],
  templateUrl: './gallery-list.component.html',
})
export class GalleryListComponent {
  private galleryApi = inject(GalleryApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  result = signal<PaginatedResult<GalleryDTO> | null>(null);
  pageNo = signal(1);
  query = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  navigateToNew() {
    this.router.navigate(['/event/gallery/new']);
  }

  navigateToEdit(item: GalleryDTO) {
    this.router.navigate(['/event/gallery', item.id, 'edit'], { state: { gallery: item } });
  }

  load() {
    this.galleryApi.search(this.pageNo(), 10, this.query() || undefined)
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

  remove(item: GalleryDTO) {
    if (!confirm(`"${item.title}" 갤러리를 삭제하시겠습니까?`)) return;
    this.galleryApi.remove(item.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toast.success('갤러리가 삭제되었습니다.'); this.load(); },
        error: () => this.toast.error('삭제 중 오류가 발생했습니다.'),
      });
  }
}
