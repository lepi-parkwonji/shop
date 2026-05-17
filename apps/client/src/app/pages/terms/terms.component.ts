import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicApiService } from '../../services/public-api.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
})
export class TermsComponent {
  private api = inject(PublicApiService);
  private destroyRef = inject(DestroyRef);

  page = signal<{ title: string; content: string } | null>(null);
  error = signal(false);

  constructor() {
    this.api.getSitePage('terms')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => this.page.set(data),
        error: () => this.error.set(true),
      });
  }
}
