import { SlicePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SearchInputComponent, SearchSuggestion } from '@demo-shop/ui';
import {
  GalleryResponseDto as GalleryDTO,
  galleryControllerRemove,
  galleryControllerSearch,
} from '@demo-shop/api-client';
import { PaginatedResult } from '@demo-shop/common';
import { map } from 'rxjs/operators';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-gallery-list',
  imports: [SlicePipe, PaginationComponent, SearchInputComponent],
  templateUrl: './gallery-list.component.html',
})
export class GalleryListComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  result = signal<PaginatedResult<GalleryDTO> | null>(null);
  pageNo = signal(1);
  query = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  suggestions = computed<SearchSuggestion[]>(() =>
    (this.result()?.items ?? []).slice(0, 5).map(g => ({ id: g.id, label: g.title })),
  );

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  navigateToNew() {
    this.router.navigate(['/expo/gallery/new']);
  }

  navigateToEdit(item: GalleryDTO) {
    this.router.navigate(['/expo/gallery', item.id, 'edit'], { state: { gallery: item } });
  }

  load() {
    galleryControllerSearch(this.http, '', { pageNo: this.pageNo(), pageSize: 10, query: this.query() || undefined })
      .pipe(map(r => r.body), takeUntilDestroyed(this.destroyRef))
      .subscribe(response => this.result.set(response));
  }

  onQueryChange(value: string) {
    this.query.set(value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.pageNo.set(1); this.load(); }, 400);
  }

  onSearch(value: string) { clearTimeout(this.searchTimer); this.query.set(value); this.pageNo.set(1); this.load(); }
  onSelect(item: SearchSuggestion) {
    const found = this.result()?.items.find(g => g.id === item.id);
    if (found) this.navigateToEdit(found);
  }
  changePage(page: number) { this.pageNo.set(page); this.load(); }

  rowNumber(index: number): number {
    const result = this.result();
    if (!result) return 0;
    const { totalItems, pageSize } = result.pageInfo;
    return totalItems - ((this.pageNo() - 1) * pageSize + index);
  }

  remove(item: GalleryDTO) {
    if (!confirm(`"${item.title}" 갤러리를 삭제하시겠습니까?`)) return;
    galleryControllerRemove(this.http, '', { id: item.id })
      .pipe(map(r => r.body), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.toast.success('갤러리가 삭제되었습니다.'); this.load(); },
        error: () => this.toast.error('삭제 중 오류가 발생했습니다.'),
      });
  }
}
