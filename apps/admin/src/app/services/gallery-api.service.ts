import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GalleryResponseDto as GalleryDTO } from '@demo-shop/api-client';
import { PaginatedResult } from '@demo-shop/common';

export type { GalleryDTO };

@Injectable({ providedIn: 'root' })
export class GalleryApiService {
  private http = inject(HttpClient);

  search(pageNo = 1, pageSize = 10, query?: string) {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<PaginatedResult<GalleryDTO>>('/api/gallery/search', { params });
  }

  findOne(id: number) {
    return this.http.get<GalleryDTO>(`/api/gallery/${id}`);
  }

  create(body: { title: string; content: string; imageUrl?: string; videoUrl?: string; keywords?: string[]; eventName?: string; shootingDate?: string }) {
    return this.http.post<GalleryDTO>('/api/gallery', body);
  }

  update(id: number, body: Partial<{ title: string; content: string; imageUrl: string; videoUrl: string; keywords: string[]; eventName: string; shootingDate: string }>) {
    return this.http.patch<GalleryDTO>(`/api/gallery/${id}`, body);
  }

  remove(id: number) {
    return this.http.delete<GalleryDTO>(`/api/gallery/${id}`);
  }

  getEventNames() {
    return this.http.get<string[]>('/api/gallery/event-names');
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>('/api/gallery/upload/image', formData);
  }
}
