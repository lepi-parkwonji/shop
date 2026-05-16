import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination.component';
import { HttpClient } from '@angular/common/http';
import { InquiryResponseDto } from '@demo-shop/api-client';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-inquiry-list',
  imports: [FormsModule, DatePipe, RouterLink, PaginationComponent],
  templateUrl: './inquiry-list.component.html',
})
export class InquiryListComponent {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  result = signal<{ items: InquiryResponseDto[]; pageInfo: { totalPages: number; totalItems: number } } | null>(null);
  pageNo = signal(1);
  query = signal('');
  needLogin = signal(false);
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.needLogin.set(this.route.snapshot.queryParamMap.get('login') === '1');
    
    effect(() => {
      if (this.authService.user()) {
        if (this.needLogin()) {
          this.needLogin.set(false);
          this.router.navigate(['/customer-service/inquiry/new']);
        }
      }
    });

    this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.searchTimer));
  }

  load() {
    const params: Record<string, string> = {
      pageNo: String(this.pageNo()),
      pageSize: '10',
    };
    if (this.query()) params['query'] = this.query();

    this.http.get<{ items: InquiryResponseDto[]; pageInfo: { totalPages: number; totalItems: number } }>(
      '/api/public/inquiries', { params }
    )
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
