import { Route } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default/default-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { NoticeListComponent } from './pages/customer-service/notice/notice-list.component';
import { NoticeDetailComponent } from './pages/customer-service/notice/notice-detail.component';
import { FaqListComponent } from './pages/customer-service/faq/faq-list.component';
import { InquiryListComponent } from './pages/customer-service/inquiry/inquiry-list.component';
import { InquiryFormComponent } from './pages/customer-service/inquiry/inquiry-form.component';
import { InquiryDetailComponent } from './pages/customer-service/inquiry/inquiry-detail.component';
import { GalleryListComponent } from './pages/gallery/gallery-list.component';
import { TermsComponent } from './pages/terms/terms.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { PreRegistrationComponent } from './pages/pre-registration/pre-registration.component';
import { RegistrationFormComponent } from './pages/pre-registration/registration-form.component';
import { RegistrationLookupComponent } from './pages/pre-registration/registration-lookup.component';
import { AuthCallbackComponent } from './pages/auth/callback/auth-callback.component';

export const appRoutes: Route[] = [
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'introduction', component: IntroductionComponent },
      { path: 'gallery', component: GalleryListComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'privacy', component: TermsComponent },
      { path: 'marketing-consent', component: TermsComponent },
      { path: 'visitor-guide', component: TermsComponent },
      {
        path: 'pre-registration',
        component: PreRegistrationComponent,
        children: [
          { path: '', redirectTo: 'form', pathMatch: 'full' },
          { path: 'form', component: RegistrationFormComponent },
          { path: 'lookup', component: RegistrationLookupComponent },
        ],
      },
      {
        path: 'customer-service',
        component: CustomerServiceComponent,
        children: [
          { path: '', redirectTo: 'notice', pathMatch: 'full' },
          { path: 'notice', component: NoticeListComponent },
          { path: 'notice/:id', component: NoticeDetailComponent },
          { path: 'faq', component: FaqListComponent },
          { path: 'inquiry', component: InquiryListComponent },
          { path: 'inquiry/new', component: InquiryFormComponent },
          { path: 'inquiry/:id', component: InquiryDetailComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
