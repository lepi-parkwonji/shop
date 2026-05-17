import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

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
      next: () => { this.toast.success('저장되었습니다.'); this.saving.set(false); },
      error: () => { this.toast.error('저장에 실패했습니다.'); this.saving.set(false); },
    });
  }
}
