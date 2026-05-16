import { Route } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default/default-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { NoticeListComponent } from './pages/customer-service/notice/notice-list.component';
import { NoticeDetailComponent } from './pages/customer-service/notice/notice-detail.component';
import { FaqListComponent } from './pages/customer-service/faq/faq-list.component';
import { InquiryListComponent } from './pages/customer-service/inquiry/inquiry-list.component';
import { InquiryFormComponent } from './pages/customer-service/inquiry/inquiry-form.component';
import { AuthCallbackComponent } from './pages/auth/callback/auth-callback.component';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'customer-service',
        component: CustomerServiceComponent,
        children: [
          { path: '', redirectTo: 'notice', pathMatch: 'full' },
          { path: 'notice', component: NoticeListComponent },
          { path: 'notice/:id', component: NoticeDetailComponent },
          { path: 'faq', component: FaqListComponent },
          { path: 'inquiry', component: InquiryListComponent },
          { path: 'inquiry/new', component: InquiryFormComponent, canActivate: [authGuard] },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
