import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FaqDTO, PaginatedResult, PublicApiService } from '../../../services/public-api.service';
import { PaginationComponent } from '../../../shared/pagination.component';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule, PaginationComponent],
  templateUrl: './faq-list.component.html',
})
export class FaqListComponent {
  private api = inject(PublicApiService);
  private destroyRef = inject(DestroyRef);

  result = signal<PaginatedResult<FaqDTO> | null>(null);
  pageNo = signal(1);
  query = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  load() {
    this.api.searchFaqs(this.pageNo(), 20, this.query() || undefined)
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
}
