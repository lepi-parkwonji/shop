import { SlicePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface SitePage { id: number; slug: string; title: string; updatedAt: string; }

const PRESET_PAGES = [
  { slug: 'terms',         title: '이용약관' },
  { slug: 'privacy',       title: '개인정보처리방침' },
  { slug: 'visitor-guide', title: '관람 안내' },
];

@Component({
  selector: 'app-site-pages-list',
  imports: [SlicePipe],
  templateUrl: './site-pages-list.component.html',
})
export class SitePagesListComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  pages = signal<SitePage[]>([]);

  get mergedPages() {
    const saved = this.pages();
    return PRESET_PAGES.map(p => ({
      ...p,
      saved: saved.find(s => s.slug === p.slug) ?? null,
    }));
  }

  ngOnInit() {
    this.http.get<SitePage[]>('/api/site/pages').subscribe(data => this.pages.set(data));
  }

  navigateToEdit(slug: string, title: string) {
    this.router.navigate(['/site/pages', slug, 'edit'], { state: { title } });
  }
}
