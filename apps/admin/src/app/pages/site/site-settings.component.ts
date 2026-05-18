import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@demo-shop/ui';

interface SiteSettings {
  businessName: string;
  businessNo: string;
  ceoName: string;
  address: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-site-settings',
  imports: [FormsModule],
  templateUrl: './site-settings.component.html',
})
export class SiteSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  saving = signal(false);

  businessName = '';
  businessNo = '';
  ceoName = '';
  address = '';
  phone = '';
  email = '';

  ngOnInit() {
    this.loading.set(true);
    this.http.get<SiteSettings>('/api/site/settings').subscribe({
      next: data => {
        this.businessName = data.businessName;
        this.businessNo   = data.businessNo;
        this.ceoName      = data.ceoName;
        this.address      = data.address;
        this.phone        = data.phone;
        this.email        = data.email;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatBusinessNo(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 10);
    let v = digits;
    if (digits.length > 5) v = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    else if (digits.length > 3) v = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    this.businessNo = v;
    input.value = v;
  }

  formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    let v = digits;
    if (digits.startsWith('02')) {
      if (digits.length > 6) v = `${digits.slice(0, 2)}-${digits.slice(2, digits.length - 4)}-${digits.slice(-4)}`;
      else if (digits.length > 2) v = `${digits.slice(0, 2)}-${digits.slice(2)}`;
    } else {
      if (digits.length > 7) v = `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
      else if (digits.length > 3) v = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    this.phone = v;
    input.value = v;
  }

  onSubmit() {
    this.saving.set(true);
    this.http.patch('/api/site/settings', {
      businessName: this.businessName,
      businessNo:   this.businessNo,
      ceoName:      this.ceoName,
      address:      this.address,
      phone:        this.phone,
      email:        this.email,
    }).subscribe({
      next: () => { this.toast.success('저장되었습니다.'); this.saving.set(false); this.router.navigate(['/site/pages']); },
      error: () => { this.toast.error('저장에 실패했습니다.'); this.saving.set(false); },
    });
  }
}
