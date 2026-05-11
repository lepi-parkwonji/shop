import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FaqDTO, PaginatedResult } from '@demo-shop/common';

export type { FaqDTO };

@Injectable({ providedIn: 'root' })
export class FaqApiService {
  private http = inject(HttpClient);

  search(pageNo = 1, pageSize = 10, query?: string) {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<PaginatedResult<FaqDTO>>('/api/faq/search', { params });
  }

  findOne(id: number) {
    return this.http.get<FaqDTO>(`/api/faq/${id}`);
  }

  create(body: { question: string; answer: string }) {
    return this.http.post<FaqDTO>('/api/faq', body);
  }

  update(id: number, body: Partial<{ question: string; answer: string }>) {
    return this.http.patch<FaqDTO>(`/api/faq/${id}`, body);
  }

  remove(id: number) {
    return this.http.delete<FaqDTO>(`/api/faq/${id}`);
  }

  togglePin(id: number) {
    return this.http.patch<FaqDTO>(`/api/faq/${id}/pin`, {});
  }

  toggleExpose(id: number) {
    return this.http.patch<FaqDTO>(`/api/faq/${id}/expose`, {});
  }
}
