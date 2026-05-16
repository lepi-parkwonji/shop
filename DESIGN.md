# Demo Shop Admin — UI 개선 계획서 (Google Stitch)

## 디자인 시스템 기준

| 항목 | 현재 값 |
|------|---------|
| CSS | Tailwind CSS 4.x + DaisyUI 5.x |
| 테마 | light (기본) |
| Primary | `oklch(0.695 0.201 258.1)` — 중청색 |
| Neutral | DaisyUI neutral (다크 네이비) — TopBar·SideMenu |
| Base-200 | 연회색 — 메인 콘텐츠 배경 |
| Base-100 | 흰색 — 카드 배경 |
| 폰트 | 시스템 기본 sans-serif |

---

## 1. 로그인 화면 `/sign-in`

### 현재 상태
- 화면 중앙에 흰색 카드 (w-96)
- "관리자 로그인" 제목 (text-center)
- 아이디 / 비밀번호 input + 로그인 버튼 (btn-primary, full width)
- 오류 메시지: `text-error`

### 개선 방향
- 브랜드 로고 또는 서비스 이름 강조
- 카드에 입체감 추가 (shadow-xl 유지)
- 배경을 단색 gray가 아닌 subtle 패턴 또는 그라데이션으로 전환

### Stitch 프롬프트
```
Admin login page for an e-commerce back-office.
Light background with a subtle diagonal pattern.
Center a clean white card (384px wide) with a drop shadow.
At the top of the card: a small square logo icon (blue) and below it "Demo Shop" in bold 20px, then "관리자 로그인" in gray 14px.
Two labeled input fields: "아이디" and "비밀번호" (password), both with a bordered style.
A full-width blue primary button labeled "로그인" at the bottom.
Below the card: nothing else, no sign-up link.
Overall tone: professional, minimal, Korean admin panel.
```

---

## 2. 기본 레이아웃 (DefaultLayout)

### 현재 상태
- **TopBar**: `fixed`, 높이 56px, 다크 네이비, 왼쪽 "Demo Shop 관리자" 텍스트, 오른쪽 관리자 이름 + 로그아웃 버튼
- **SideMenu**: 너비 224px, 다크 네이비, 섹션 라벨(소문자 대문자 처리) + 메뉴 링크, active 시 배경 강조
- **Main**: `flex-1`, `bg-base-200`, `p-6`

### 개선 방향
- TopBar에 브레드크럼 또는 현재 페이지명 추가
- SideMenu active 링크 왼쪽에 컬러 바(indicator) 추가
- 향후 메뉴 확장 시 접힘/펼침(accordion) 구조 대비

### Stitch 프롬프트
```
Admin dashboard shell layout.
Fixed top navigation bar (56px height), dark navy (#1d232a), full width.
Left side of nav: white bold text "Demo Shop 관리자".
Right side of nav: small muted text showing an admin username, then an outlined white "로그아웃" button.

Left sidebar (224px wide), same dark navy, starts below the nav bar, full page height.
Sidebar has one section labeled "고객센터" in small uppercase muted text.
Under it: two menu items "공지사항" and "FAQ". Active item has a blue left border (3px) and slightly lighter background, white text. Inactive items are muted white/70, hover slightly lighter.

Main content area to the right of the sidebar, light gray background (#f2f2f2), padding 24px.
Show a content placeholder card inside.
```

---

## 3. 공지사항 목록 `/customer/notice`

### 현재 상태
- `max-w-4xl` 컨테이너
- 헤더: "공지사항" 제목 + "+ 등록" 버튼 (btn-primary btn-sm)
- 검색 input + "검색" 버튼
- 줄무늬 테이블: 번호 / 제목(클릭 이동) / 고정 토글 / 노출 토글 / 작성일 / 삭제
- 고정 버튼: `btn-warning` (고정) / `btn-outline btn-warning` (고정안함), 너비 80px
- 노출 버튼: `btn-success` (노출) / `btn-outline btn-success` (숨김), 너비 64px
- 하단 이전/다음 페이지네이션

### 개선 방향
- 검색 필터에 "고정 여부", "노출 여부" 셀렉트 추가
- 테이블 행 hover 시 배경색 전환 명시
- 페이지네이션을 숫자 버튼 방식으로 개선

### Stitch 프롬프트
```
Admin notice management list page. Korean language UI.
Page width max 896px, light gray page background.

Top bar of the page:
- Left: bold heading "공지사항" (20px)
- Right: small blue primary button "+ 등록"

Search row below heading:
- Text input (flex-1) placeholder "제목 또는 내용 검색"
- Gray "검색" button

White card with a zebra-striped table inside:
Columns: "번호" (64px) | "제목" (flex) | "고정" (96px center) | "노출" (96px center) | "작성일" (112px) | "관리" (64px)

Sample rows:
- Row 1: id=3 | "서비스 점검 안내" (blue link text) | yellow filled button "고정" 80px | green filled button "노출" 64px | 2025-01-10 | red outline "삭제" button
- Row 2: id=2 | "이용약관 변경 안내" | yellow outline button "고정안함" | green outline button "숨김" | 2025-01-05 | red outline "삭제" button

Bottom pagination: "이전" ghost button — "1 / 3" text — "다음" ghost button, centered.
```

---

## 4. 공지사항 등록/수정 폼 `/customer/notice/new`

### 현재 상태
- `max-w-2xl` 컨테이너
- 제목 input (input-bordered, full width)
- 내용 textarea (min-h-48)
- 오류 메시지
- 하단 취소(btn-ghost) + 저장(btn-primary) 버튼

### 개선 방향
- 제목 글자 수 카운터 표시
- 저장 버튼 상태(loading 스피너) 시각화
- isEdit 시 상단에 "최종 수정일" 정보 표시

### Stitch 프롬프트
```
Admin notice creation form page. Korean language UI.
Page width max 672px.

Top: bold heading "공지사항 등록" (20px).

White card below with form fields:
1. Label "제목 *" (14px medium) + text input, full width, bordered style, placeholder "제목을 입력하세요". Right-aligned character counter "0 / 100" in muted gray.
2. Label "내용 *" + textarea, full width, min height 192px, bordered style, placeholder "내용을 입력하세요".

Bottom of card, right-aligned action row:
- "취소" ghost button (gray text)
- "저장" blue primary button

No error state visible in default view.
Clean, minimal form card with subtle shadow.
```

---

## 5. FAQ 목록 `/customer/faq`

### 현재 상태
- 공지사항 목록과 동일한 구조
- 테이블 컬럼: 번호 / 질문 / 고정 / 노출 / 작성일 / 관리

### 개선 방향
- 공지사항과 동일한 방향
- 질문 텍스트가 길 경우 줄임표(truncate) 처리 명시

### Stitch 프롬프트
```
Admin FAQ management list page. Korean language UI.
Identical layout structure to the notice list page above, but:
- Heading: "FAQ"
- Search placeholder: "질문 또는 답변 검색"
- Table columns: "번호" | "질문" (flex, text truncated with ellipsis if long) | "고정" | "노출" | "작성일" | "관리"
- Sample row question text: "배송은 얼마나 걸리나요?"
Same button styles as notice list (yellow/green toggle buttons, red delete button).
```

---

## 6. FAQ 등록/수정 폼 `/customer/faq/new`

### 현재 상태
- `max-w-2xl` 컨테이너
- 질문 input + 답변 textarea (min-h-40)
- 취소 / 저장 버튼

### 개선 방향
- 공지사항 폼과 동일
- 답변 textarea 높이를 조금 더 크게 (min-h-48)

### Stitch 프롬프트
```
Admin FAQ creation form page. Korean language UI.
Page width max 672px.

Top: bold heading "FAQ 등록".

White card:
1. Label "질문 *" + text input, full width, bordered, placeholder "질문을 입력하세요".
2. Label "답변 *" + textarea, full width, min height 192px, bordered, placeholder "답변을 입력하세요".

Bottom right: "취소" ghost button + "저장" blue primary button.
```

---

## 개선 우선순위

| 우선순위 | 항목 | 난이도 |
|----------|------|--------|
| 🔴 High | SideMenu active 인디케이터 (좌측 컬러 바) | 낮음 |
| 🔴 High | 로그인 카드 로고/브랜딩 추가 | 낮음 |
| 🟡 Mid | 목록 검색 필터 확장 (고정/노출 여부) | 중간 |
| 🟡 Mid | 폼 제목 글자 수 카운터 | 낮음 |
| 🟡 Mid | 페이지네이션 숫자 버튼 방식 | 중간 |
| 🟢 Low | 배경 패턴/그라데이션 (로그인 페이지) | 낮음 |
| 🟢 Low | 질문 텍스트 truncate (FAQ 목록) | 낮음 |
