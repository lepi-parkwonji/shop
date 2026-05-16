import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<string | null>(null);

const SKIP_REFRESH = ['/api/admin/refresh', '/api/admin/signin'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const authService = inject(AuthService);

  const skipRefresh = SKIP_REFRESH.some(url => req.url.includes(url));
  const token = skipRefresh ? null : localStorage.getItem('accessToken');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || skipRefresh) {
        return throwError(() => error);
      }

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        authService.clearSession();
        router.navigate(['/sign-in']);
        return throwError(() => error);
      }

      // 동시에 여러 요청이 401을 받으면 한 번만 refresh 시도
      if (isRefreshing) {
        return refreshDone$.pipe(
          filter(t => t !== null),
          take(1),
          switchMap(newToken =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })),
          ),
        );
      }

      isRefreshing = true;
      refreshDone$.next(null);

      // 리프레시 토큰을 Bearer로 전송 — 서버의 @Auth() JWT 검증 통과
      return http
        .post<{ accessToken: string }>(
          '/api/admin/refresh',
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        )
        .pipe(
          switchMap(({ accessToken }) => {
            isRefreshing = false;
            localStorage.setItem('accessToken', accessToken);
            refreshDone$.next(accessToken);
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
          }),
          catchError(refreshError => {
            isRefreshing = false;
            authService.clearSession();
            router.navigate(['/sign-in']);
            return throwError(() => refreshError);
          }),
        );
    }),
  );
};
