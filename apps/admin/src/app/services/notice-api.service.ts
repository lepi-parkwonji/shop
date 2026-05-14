import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NoticeResponseDto as NoticeDTO } from '@demo-shop/api-client';
import { PaginatedResult } from '@demo-shop/common';

export type { NoticeDTO, PaginatedResult };

@Injectable({ providedIn: 'root' })
export class NoticeApiService {
  private http = inject(HttpClient);

  search(pageNo = 1, pageSize = 10, query?: string) {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<PaginatedResult<NoticeDTO>>('/api/notice/search', { params });
  }

  findOne(id: number) {
    return this.http.get<NoticeDTO>(`/api/notice/${id}`);
  }

  create(body: { title: string; content: string }) {
    return this.http.post<NoticeDTO>('/api/notice', body);
  }

  update(id: number, body: Partial<{ title: string; content: string }>) {
    return this.http.patch<NoticeDTO>(`/api/notice/${id}`, body);
  }

  remove(id: number) {
    return this.http.delete<NoticeDTO>(`/api/notice/${id}`);
  }

  togglePin(id: number) {
    return this.http.patch<NoticeDTO>(`/api/notice/${id}/pin`, {});
  }

  toggleExpose(id: number) {
    return this.http.patch<NoticeDTO>(`/api/notice/${id}/expose`, {});
  }
}
