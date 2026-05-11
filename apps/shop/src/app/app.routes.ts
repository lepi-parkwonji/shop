import { Route } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { NoticeListComponent } from './pages/customer-service/notice/notice-list.component';
import { NoticeDetailComponent } from './pages/customer-service/notice/notice-detail.component';
import { FaqListComponent } from './pages/customer-service/faq/faq-list.component';

export const appRoutes: Route[] = [
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
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
