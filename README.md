# demo-shop

Nx 모노레포 기반의 쇼핑몰 관리 시스템입니다.

## 기술 스택

| 영역 | 기술 |
|---|---|
| 모노레포 | Nx |
| 백엔드 | NestJS, Prisma 7, PostgreSQL |
| 프론트엔드 | Angular 21, Tailwind CSS 4, DaisyUI 5 |
| 인증 | JWT (accessToken 1h / refreshToken 7d), bcrypt |

## 프로젝트 구조

```
apps/
  server/       — NestJS API 서버 (포트 3000)
  admin/        — 관리자 패널 (포트 4200)
  shop/         — 고객 공개 페이지 (포트 4201)
libs/
  common/       — 앱 간 공유 인터페이스 (NoticeDTO, FaqDTO, PaginatedResult 등)
prisma/
  schema.prisma — DB 스키마
  seed.ts       — 초기 관리자 계정 생성
```

## 앱별 기능

### server
- `POST /api/admin/signin` — 관리자 로그인
- `GET  /api/admin/me` — 내 정보 조회
- `POST /api/admin/refresh` — 토큰 갱신
- `POST /api/admin/logout` — 로그아웃
- `/api/notice/*` — 공지사항 CRUD + 고정/노출 토글 (인증 필요)
- `/api/faq/*` — FAQ CRUD + 고정/노출 토글 (인증 필요)
- `/api/public/notices` — 노출 공지사항 목록/상세 (인증 불필요)
- `/api/public/faqs` — 노출 FAQ 목록 (인증 불필요)

### admin
- 로그인 / 로그아웃
- 공지사항 목록·등록·수정·삭제·고정·노출 토글
- FAQ 목록·등록·수정·삭제·고정·노출 토글

### shop
- 고객센터 페이지 (공지사항 탭 / FAQ 탭)
- 공지사항 목록 및 상세
- FAQ 아코디언 목록

## 로컬 개발 환경

### 필수 조건
- Node.js
- PostgreSQL

### 환경 변수

`apps/server/.env` 파일 생성:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/demo_shop
JWT_SECRET=your-secret-key
```

### 실행

```bash
# 의존성 설치
npm install

# DB 마이그레이션 및 시드
npx prisma migrate dev --config prisma.config.ts
npx prisma db seed --config prisma.config.ts

# 서버 실행 (터미널 1)
npx nx serve server

# 관리자 앱 실행 (터미널 2)
npx nx serve admin

# 고객 앱 실행 (터미널 3)
npx nx serve shop -- --port 4201
```

### Prisma Studio

```bash
npx prisma studio --config prisma.config.ts
```

## 브랜치 전략

```
main        — 배포 가능한 안정 상태
develop     — 통합 브랜치
feat/xxx    — 기능 개발
fix/xxx     — 버그 수정
```

작업은 `develop`에서 분기 → PR → `main` 병합 순서로 진행합니다.

## 유용한 명령어

```bash
# 전체 빌드
npx nx run-many -t build

# 의존성 그래프 시각화
npx nx graph
```
