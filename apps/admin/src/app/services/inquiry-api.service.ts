import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InquiryResponseDto as InquiryDTO } from '@demo-shop/api-client';
import { PaginatedResult } from '@demo-shop/common';

export type { InquiryDTO };

@Injectable({ providedIn: 'root' })
export class InquiryApiService {
  private http = inject(HttpClient);

  search(pageNo = 1, pageSize = 10, query?: string) {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<PaginatedResult<InquiryDTO>>('/api/inquiry/search', { params });
  }

  findOne(id: number) {
    return this.http.get<InquiryDTO>(`/api/inquiry/${id}`);
  }

  answer(id: number, body: { answer: string }) {
    return this.http.patch<InquiryDTO>(`/api/inquiry/${id}/answer`, body);
  }

  toggleExpose(id: number) {
    return this.http.patch<InquiryDTO>(`/api/inquiry/${id}/expose`, {});
  }

  remove(id: number) {
    return this.http.delete<InquiryDTO>(`/api/inquiry/${id}`);
  }
}
