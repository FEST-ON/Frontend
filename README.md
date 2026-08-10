# FESTAI

**AI · ESG 기반 지역축제 DX(디지털 전환) 웹앱 — PPT용 유저플로우 데모**

FESTAI는 지역축제 운영을 "신뢰(Trust)"라는 키워드로 재설계한 플랫폼입니다. 방문객에게는 AI 기반 자연어 안내와 QR 모바일 웹을, 축제 담당 주무관에게는 통합 운영관리·ESG 성과관리 대시보드를 제공합니다. 이 저장소는 **PPT 유저플로우 제작을 위한 데모 버전**으로, 실제 백엔드/AI API 연동 없이 목(mock) 데이터와 클라이언트 상태로 전체 화면 흐름을 시연합니다.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Server State | TanStack Query (mock async fetcher 기반) |
| Client State | Zustand (`persist` 미들웨어로 일부 상태 로컬 저장) |
| UI Kit | shadcn/ui (base-ui 기반) |
| AI (예정 연동) | Perso AI, 앨런(Alan) — 현재는 규칙 기반 mock 응답으로 대체 |
| Deployment | Vercel |

## 폴더 구조 (FSD 기반)

```
src/
├── app/                     # Next.js App Router, 전역 레이아웃/스타일/프로바이더
│   ├── (public)/visitor/    # 방문객(30대) 화면 — QR 모바일 웹
│   └── (protected)/admin/   # 축제 담당 주무관 화면 — 통합 운영 콘솔
├── shared/                  # 공용 UI(shadcn), 유틸, lib
├── entities/                # 비즈니스 엔티티: festival, program, ticket, esg, visitor, coupon
├── features/                # 유저 상호작용 기능: ai-guide, ticket-board, reservation, stamp-tour, accessibility, complaint-insight
└── widgets/                 # 화면 조합 컴포넌트: site nav/topbar, sidebar, congestion-map, dashboard-stats
```

## 핵심 기능 & 대응 화면

| 스펙 | 화면 경로 |
| --- | --- |
| 6.1 AI 축제 안내 (자연어 Q&A, 맞춤 코스 추천, 혼잡도 기반 대체 안내, 접근성 모드) | `/visitor/ai-guide`, 우측 상단 접근성(♿) 버튼 |
| 6.2 통합 운영관리 (자원 통합관리, 민원/공지/사고 티켓, 운영 대시보드, AI 민원 분류) | `/admin`, `/admin/programs`, `/admin/tickets`, `/admin/ai-insights` |
| 6.3 방문객 QR 모바일 웹 (일정/지도/시설/교통, 예약·대기표, 스탬프투어, 디지털 쿠폰) | `/visitor`, `/visitor/map`, `/visitor/schedule`, `/visitor/reservation`, `/visitor/stamp-tour`, `/visitor/survey` |
| 6.4 ESG 성과관리 (자동 집계, 사회성과 측정, 데이터 출처/승인 이력, AI 보고서 초안) | `/admin/esg` |

랜딩 페이지(`/`)에서 방문객·운영자 두 시나리오로 진입할 수 있습니다.

## 실행 방법

### 1) 의존성 설치

```bash
npm install
```

### 2) 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

- 방문객 플로우: `/visitor`
- 운영자 플로우: `/admin`

### 3) 프로덕션 빌드 확인

```bash
npm run build
npm run start
```

### 4) 린트

```bash
npm run lint
```

## 데모 데이터 & 상태 관리 안내

- 모든 도메인 데이터(축제 정보, 일정, 시설, 혼잡도, 티켓, ESG 지표 등)는 `src/entities/*/data.ts`에 하드코딩된 mock 데이터이며, `delay()`로 실제 API 호출처럼 지연을 흉내내어 TanStack Query와 연동했습니다.
- AI 채팅 응답(`src/features/ai-guide/lib/generate-reply.ts`)은 키워드 매칭 기반의 규칙형 mock이며, 실제 연동 시 **Perso AI**(자연어 생성) 및 **앨런(Alan)**으로 교체될 지점입니다.
- 접근성 설정(`features/accessibility`)과 스탬프 투어 진행 상황(`features/stamp-tour`)은 Zustand `persist`로 브라우저 `localStorage`에 저장되어 새로고침 후에도 유지됩니다.
- 민원/공지/사고 티켓 상태 변경, 대기표 발급 등은 세션 내 Zustand 상태로만 관리되며 새로고침 시 초기값으로 리셋됩니다(데모 목적).

## Vercel 배포

```bash
npx vercel
```

또는 GitHub 저장소를 Vercel에 연결하면 자동 배포됩니다. 별도 환경변수 없이 바로 빌드 가능합니다(외부 API 연동 전 데모 상태 기준).
