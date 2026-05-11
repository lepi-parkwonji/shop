import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DefaultLayoutComponent } from './layout/default/default-layout.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { NoticeListComponent } from './pages/customer/notice/notice-list.component';
import { NoticeFormComponent } from './pages/customer/notice/notice-form.component';
import { FaqListComponent } from './pages/customer/faq/faq-list.component';
import { FaqFormComponent } from './pages/customer/faq/faq-form.component';

export const appRoutes: Route[] = [
  { path: 'sign-in', component: SignInComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'customer/notice', pathMatch: 'full' },
      { path: 'customer/notice', component: NoticeListComponent },
      { path: 'customer/notice/new', component: NoticeFormComponent },
      { path: 'customer/notice/:id/edit', component: NoticeFormComponent },
      { path: 'customer/faq', component: FaqListComponent },
      { path: 'customer/faq/new', component: FaqFormComponent },
      { path: 'customer/faq/:id/edit', component: FaqFormComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
