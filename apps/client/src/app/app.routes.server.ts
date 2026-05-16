import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'auth/callback', renderMode: RenderMode.Client },
  { path: 'customer-service/inquiry/new', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
