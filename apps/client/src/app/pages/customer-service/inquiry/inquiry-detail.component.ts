import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InquiryResponseDto } from '@demo-shop/api-client';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-inquiry-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './inquiry-detail.component.html',
})
export class InquiryDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  inquiry = signal<InquiryResponseDto | null>(null);
  error = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const user = this.authService.user();
    const url = user ? `/api/client/inquiries/${id}` : `/api/public/inquiries/${id}`;

    this.http.get<InquiryResponseDto>(url).subscribe({
      next: inquiry => this.inquiry.set(inquiry),
      error: (err) => {
        if (err.status === 403) {
          this.error.set(user
            ? '비밀글입니다. 본인만 확인할 수 있습니다.'
            : '비밀글입니다. 로그인 후 확인하세요.');
        } else {
          this.error.set('문의를 불러올 수 없습니다.');
        }
      },
    });
  }
}
