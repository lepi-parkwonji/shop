import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FaqResponseDto as FaqDTO, NoticeResponseDto as NoticeDTO } from '@demo-shop/api-client';
import { PaginatedResult } from '@demo-shop/common';

export type { NoticeDTO, FaqDTO, PaginatedResult };

@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private http = inject(HttpClient);

  searchNotices(pageNo = 1, pageSize = 10, query?: string) {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<PaginatedResult<NoticeDTO>>('/api/public/notices', { params });
  }

  findOneNotice(id: number) {
    return this.http.get<NoticeDTO>(`/api/public/notices/${id}`);
  }

  searchFaqs(pageNo = 1, pageSize = 20, query?: string) {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<PaginatedResult<FaqDTO>>('/api/public/faqs', { params });
  }
}
