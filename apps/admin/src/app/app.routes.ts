import { Route } from '@angular/router';
import { authGuard, authGuardChild } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/auth/sign-in/sign-in.component').then(m => m.SignInComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/default/default-layout.component').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    canActivateChild: [authGuardChild],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        data: { title: '대시보드' },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'customer/notice',
        loadComponent: () => import('./pages/customer/notice/notice-list.component').then(m => m.NoticeListComponent),
      },
      {
        path: 'customer/notice/new',
        loadComponent: () => import('./pages/customer/notice/notice-form.component').then(m => m.NoticeFormComponent),
      },
      {
        path: 'customer/notice/:id/edit',
        loadComponent: () => import('./pages/customer/notice/notice-form.component').then(m => m.NoticeFormComponent),
      },
      {
        path: 'customer/faq',
        loadComponent: () => import('./pages/customer/faq/faq-list.component').then(m => m.FaqListComponent),
      },
      {
        path: 'customer/faq/new',
        loadComponent: () => import('./pages/customer/faq/faq-form.component').then(m => m.FaqFormComponent),
      },
      {
        path: 'customer/faq/:id/edit',
        loadComponent: () => import('./pages/customer/faq/faq-form.component').then(m => m.FaqFormComponent),
      },
      {
        path: 'customer/inquiry',
        loadComponent: () => import('./pages/customer/inquiry/inquiry-list.component').then(m => m.InquiryListComponent),
      },
      {
        path: 'customer/inquiry/:id/answer',
        loadComponent: () => import('./pages/customer/inquiry/inquiry-form.component').then(m => m.InquiryFormComponent),
      },
      {
        path: 'event/gallery',
        loadComponent: () => import('./pages/event/gallery/gallery-list.component').then(m => m.GalleryListComponent),
      },
      {
        path: 'event/gallery/new',
        loadComponent: () => import('./pages/event/gallery/gallery-form.component').then(m => m.GalleryFormComponent),
      },
      {
        path: 'event/gallery/:id/edit',
        loadComponent: () => import('./pages/event/gallery/gallery-form.component').then(m => m.GalleryFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
