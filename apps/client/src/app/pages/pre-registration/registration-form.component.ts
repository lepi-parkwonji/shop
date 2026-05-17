import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ScheduleDTO, RegistrationDTO, PublicApiService } from '../../services/public-api.service';

@Component({
  selector: 'app-registration-form',
  imports: [FormsModule],
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent {
  private api = inject(PublicApiService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  schedules = signal<ScheduleDTO[]>([]);
  loading = signal(false);
  errorMsg = signal('');
  result = signal<RegistrationDTO | null>(null);

  name = '';
  contact = '';
  fairName = '';
  privacyConsent = false;
  marketingConsent = false;

  constructor() {
    this.api.getPublicSchedules()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(items => this.schedules.set(items));

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.result.set(null);
      this.name = '';
      this.contact = '';
      this.fairName = '';
      this.privacyConsent = false;
      this.marketingConsent = false;
      this.errorMsg.set('');
    });
  }

  onContactInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.startsWith('02')) {
      if (raw.length <= 6) formatted = raw.replace(/(\d{2})(\d+)/, '$1-$2');
      else if (raw.length <= 9) formatted = raw.replace(/(\d{2})(\d{3,4})(\d+)/, '$1-$2-$3');
      else formatted = raw.replace(/(\d{2})(\d{4})(\d+)/, '$1-$2-$3');
    } else {
      if (raw.length <= 7) formatted = raw.replace(/(\d{3})(\d+)/, '$1-$2');
      else if (raw.length <= 10) formatted = raw.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
      else formatted = raw.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
    }
    this.contact = formatted;
    (event.target as HTMLInputElement).value = formatted;
  }

  onSubmit() {
    this.errorMsg.set('');
    if (!this.name.trim()) { this.errorMsg.set('이름을 입력해주세요.'); return; }
    if (!this.contact.trim()) { this.errorMsg.set('연락처를 입력해주세요.'); return; }
    if (!this.fairName) { this.errorMsg.set('참가할 박람회를 선택해주세요.'); return; }
    if (!this.privacyConsent) { this.errorMsg.set('개인정보 수집 및 이용에 동의해주세요.'); return; }

    this.loading.set(true);
    this.api.createRegistration({
      name: this.name.trim(),
      contact: this.contact.trim(),
      fairName: this.fairName,
      marketingConsent: this.marketingConsent,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => { this.result.set(data); this.loading.set(false); },
        error: err => {
          const msg = err?.error?.message;
          this.errorMsg.set(Array.isArray(msg) ? msg[0] : (msg || '등록에 실패했습니다. 다시 시도해주세요.'));
          this.loading.set(false);
        },
      });
  }
}
